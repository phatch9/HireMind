import { supabase } from '../supabase';
import { AtsAnalysisResponse, AtsEvaluationRecord } from '../types';

/** Base URL for the FastAPI backend */
const API_BASE_URL = 'http://localhost:7000';

export const atsApi = {
    /**
     * Send a PDF resume and job description to the FastAPI backend for analysis.
     */
    async analyzeResume(resumeFile: File, jobDescription: string): Promise<AtsAnalysisResponse> {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('job_description', jobDescription);

        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header, fetch will set it automatically with the correct boundary for FormData
        });

        if (!response.ok) {
            let errorMsg = 'Failed to analyze resume';
            try {
                const errorData = await response.json();
                if (errorData.detail && errorData.detail.detail) {
                    errorMsg = errorData.detail.detail;
                }
            } catch (e) {
                // Ignore parsing errors
            }
            throw new Error(errorMsg);
        }

        return await response.json() as AtsAnalysisResponse;
    },

    /**
     * Save an evaluation result to the Supabase database.
     */
    async saveEvaluation(
        userId: string,
        resumeFilename: string,
        evaluation: AtsAnalysisResponse,
        applicationId?: string
    ): Promise<AtsEvaluationRecord> {
        const { data, error } = await supabase
            .from('ats_evaluations')
            .insert([{
                user_id: userId,
                application_id: applicationId || null,
                resume_text: 'Extracted by FastAPI backend', // In a real app we might want to store this, but for now we'll just put a placeholder as the backend doesn't return it
                job_description_text: 'Sent to backend', // Same here
                resume_filename: resumeFilename,
                match_score: evaluation.match_score,
                missing_keywords: evaluation.missing_keywords,
                present_keywords: evaluation.present_keywords,
                recommendations: evaluation.recommendations,
                summary: evaluation.summary,
                model_used: evaluation.model_used,
                evaluation_version: evaluation.evaluation_version,
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to save evaluation to database: ${error.message}`);
        }

        return data as AtsEvaluationRecord;
    },

    /**
     * Fetch historical evaluations for the current user.
     */
    async getHistoricalEvaluations(): Promise<AtsEvaluationRecord[]> {
        const { data, error } = await supabase
            .from('ats_evaluations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch historical evaluations: ${error.message}`);
        }

        return data as AtsEvaluationRecord[];
    }
};
