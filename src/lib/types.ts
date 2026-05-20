import type { ApplicationPipelineFields, JobEvaluation, FitGrade } from './evaluation';

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export type { JobEvaluation, FitGrade, ApplicationPipelineFields };

export interface Company {
    id: string;
    user_id: string;
    name: string;
    website?: string;
    description?: string;
    location?: string;
    created_at: string;
    updated_at: string;
}

export interface Application extends ApplicationPipelineFields {
    id: string;
    user_id: string;
    company_id: string;
    company?: Company;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    location?: string;
    job_url?: string;
    applied_date?: string;
    interview_date?: string;
    offer_date?: string;
    rejected_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Note {
    id: string;
    user_id: string;
    application_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Reminder {
    id: string;
    user_id: string;
    application_id?: string;
    application?: Application; // Joined fields
    title: string;
    due_date: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    user_id: string;
    application_id?: string;
    name: string;
    file_path: string;
    file_type: string;
    size: number;
    created_at: string;
}

// Form data types
export interface CompanyFormData {
    name: string;
    website?: string;
    description?: string;
    location?: string;
}

export interface ApplicationFormData {
    company_id: string;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    location?: string;
    job_url?: string;
    applied_date?: string;
    interview_date?: string;
    offer_date?: string;
    rejected_date?: string;
}

/** Merges Kanban form fields with AI pipeline columns for Supabase updates. */
export type ApplicationUpdatePayload = Partial<ApplicationFormData & ApplicationPipelineFields>;

export interface NoteFormData {
    application_id: string;
    content: string;
}

export interface ReminderFormData {
    application_id?: string;
    title: string;
    due_date: string;
    completed?: boolean;
}

// UI types
export interface StatusColumn {
    id: ApplicationStatus;
    title: string;
    applications: Application[];
}

export interface DashboardStats {
    total: number;
    wishlist: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
}

// ─── ATS Analysis types ───────────────────────────────────────────────────────

/**
 * Response shape returned by POST /analyze on the FastAPI backend.
 * Mirrors models/schemas.py :: AnalyzeResponse.
 */
export interface AtsAnalysisResponse {
    match_score: number;            // 0–100
    missing_keywords: string[];
    present_keywords: string[];
    recommendations: string[];
    summary: string;
    resume_char_count: number;
    model_used: string;
    evaluation_version: string;
}

/**
 * Persisted record in the ats_evaluations Supabase table.
 */
export interface AtsEvaluationRecord {
    id: string;
    user_id: string;
    application_id?: string;
    resume_filename?: string;
    match_score: number;
    missing_keywords: string[];
    present_keywords: string[];
    recommendations: string[];
    summary: string;
    model_used: string;
    evaluation_version: string;
    created_at: string;
}

/** Input to the useAtsEvaluation hook's analyze() function. */
export interface AtsAnalysisInput {
    resumeFile: File;
    jobDescription: string;
    applicationId?: string;
}
