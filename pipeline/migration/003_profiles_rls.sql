-- ============================================================================
-- Migration 003: profiles table + ats_evaluations + RLS on all core tables
-- Run AFTER core_tables.sql and 002_ai_pipeline_applications.sql
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE (linked to Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  headline    TEXT,                     -- e.g. "Junior Software Engineer"
  location    TEXT,
  linkedin_url TEXT,
  github_url  TEXT,
  -- CV / resume context used by AI pipeline
  master_cv_text TEXT,                  -- plain-text master resume for LLM context
  profile_context_version TEXT DEFAULT '1.0',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'One row per authenticated user; extends auth.users';
COMMENT ON COLUMN profiles.master_cv_text IS 'Plain-text master resume used as context by the AI evaluation pipeline';
COMMENT ON COLUMN profiles.profile_context_version IS 'Version tag so evaluation results can be invalidated when the profile changes';

-- Auto-create profile row on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. ATS EVALUATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ats_evaluations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id        UUID REFERENCES applications(id) ON DELETE SET NULL,

  -- Input snapshot
  resume_text           TEXT NOT NULL,      -- extracted PDF text sent to LLM
  job_description_text  TEXT NOT NULL,      -- JD text provided by user
  resume_filename       TEXT,               -- original filename for display

  -- Structured output from OpenAI
  match_score           NUMERIC(5, 2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  missing_keywords      TEXT[]  NOT NULL DEFAULT '{}',
  present_keywords      TEXT[]  NOT NULL DEFAULT '{}',
  recommendations       TEXT[]  NOT NULL DEFAULT '{}',
  summary               TEXT,

  -- Provenance
  model_used            TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  evaluation_version    TEXT NOT NULL DEFAULT '1.0',

  created_at            TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ats_evaluations IS 'Historical ATS keyword analysis reports produced by the Python FastAPI analysis engine';
COMMENT ON COLUMN ats_evaluations.match_score IS '0–100 ATS compatibility score';
COMMENT ON COLUMN ats_evaluations.missing_keywords IS 'Keywords from JD absent in the resume';
COMMENT ON COLUMN ats_evaluations.present_keywords IS 'Keywords from JD already present in the resume';
COMMENT ON COLUMN ats_evaluations.recommendations IS 'Ordered list of specific resume tailoring suggestions';

CREATE INDEX IF NOT EXISTS idx_ats_evaluations_user_id
  ON ats_evaluations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ats_evaluations_application_id
  ON ats_evaluations (application_id)
  WHERE application_id IS NOT NULL;

-- ============================================================================
-- 3. ROW LEVEL SECURITY (all core tables)
-- ============================================================================

-- Enable RLS
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_evaluations ENABLE ROW LEVEL SECURITY;

-- profiles: each user owns their own row
CREATE POLICY "profiles: own row only"
  ON profiles FOR ALL
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- companies: user owns all their company rows
CREATE POLICY "companies: own rows only"
  ON companies FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- applications: user owns all their application rows
CREATE POLICY "applications: own rows only"
  ON applications FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ats_evaluations: user owns all their evaluation rows
CREATE POLICY "ats_evaluations: own rows only"
  ON ats_evaluations FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also check reminders and notes tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reminders') THEN
    ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'reminders: own rows only'
    ) THEN
      EXECUTE 'CREATE POLICY "reminders: own rows only"
        ON reminders FOR ALL
        USING  (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid())';
    END IF;
  END IF;
END $$;

-- ============================================================================
-- 4. GRANTS (authenticated users only — RLS handles row filtering)
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ats_evaluations TO authenticated;

-- Revoke overly-broad anonymous grants from core_tables.sql
REVOKE ALL ON companies    FROM anon;
REVOKE ALL ON applications FROM anon;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 003 complete at %', NOW();
  RAISE NOTICE 'Created: profiles, ats_evaluations';
  RAISE NOTICE 'Enabled RLS on: profiles, companies, applications, ats_evaluations';
END $$;
