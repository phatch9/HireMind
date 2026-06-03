import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { atsApi } from '../lib/api/ATS';
import { AtsAnalysisResponse, AtsEvaluationRecord } from '../lib/types';

export function useAtsEvaluation() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastEvaluation, setLastEvaluation] = useState<AtsAnalysisResponse | null>(null);
    const [history, setHistory] = useState<AtsEvaluationRecord[]>([]);

    const fetchHistory = useCallback(async () => {
        try {
            const data = await atsApi.getHistoricalEvaluations();
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch ATS history:', err);
        }
    }, []);

    const analyze = async (resumeFile: File, jobDescription: string, applicationId?: string) => {
        if (!user) {
            setError('You must be logged in to analyze resumes');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Get analysis from FastAPI
            const result = await atsApi.analyzeResume(resumeFile, jobDescription);
            setLastEvaluation(result);

            // 2. Save to Supabase
            await atsApi.saveEvaluation(user.id, resumeFile.name, result, applicationId);
            
            // 3. Refresh history
            await fetchHistory();

            return result;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        analyze,
        fetchHistory,
        loading,
        error,
        lastEvaluation,
        history,
        setLastEvaluation
    };
}
