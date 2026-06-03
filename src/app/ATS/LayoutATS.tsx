import { useState, useEffect } from 'react';
import { useAtsEvaluation } from '../../hooks/useAtsEvaluation';
import ResumeDropzone from '../../components/ATS/ResumeDropzone';
import EvaluationResult from '../../components/ATS/EvaluationResult';

export default function LayoutATS() {
    const { analyze, loading, error, lastEvaluation, fetchHistory, history, setLastEvaluation } = useAtsEvaluation(); // call components from hooks
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [activeTab, setActiveTab] = useState<'analyzer' | 'history'>('analyzer');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, fetchHistory]);

    const handleAnalyze = async () => {
        if (!resumeFile || !jobDescription.trim()) return;
        await analyze(resumeFile, jobDescription);
    };

    const reset = () => {
        setLastEvaluation(null);
        setResumeFile(null);
        setJobDescription('');
    };

    return (
        <div className="ats-container">
            <div className="ats-header">
                <h1>AI Resume Optimizer</h1>
                <p className="text-secondary">Scan your resume against any job description to find keyword gaps and get tailoring advice.</p>
            </div>

            <div className="ats-tabs glass-card">
                <button 
                    className={`ats-tab ${activeTab === 'analyzer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analyzer')}
                >
                    Analyzer
                </button>
                <button 
                    className={`ats-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            {activeTab === 'analyzer' ? (
                <div className="analyzer-view">
                    {!lastEvaluation ? (
                        <div className="analyzer-form glass-card">
                            <div className="form-section">
                                <label className="form-label">1. Upload Resume (PDF)</label>
                                <ResumeDropzone 
                                    onFileSelect={setResumeFile}
                                    selectedFile={resumeFile}
                                />
                            </div>

                            <div className="form-section">
                                <label className="form-label">2. Paste Job Description</label>
                                <textarea 
                                    className="jd-textarea glass"
                                    placeholder="Paste the full job description text here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={10}
                                />
                            </div>

                            {error && <div className="error-box">{error}</div>}

                            <div className="form-actions">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    disabled={!resumeFile || !jobDescription.trim() || loading}
                                    onClick={handleAnalyze}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-sm"></span>
                                            Analyzing...
                                        </>
                                    ) : "Start Analysis"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="result-view">
                            <div className="result-actions">
                                <button className="btn btn-ghost" onClick={reset}>
                                    ← New Analysis
                                </button>
                            </div>
                            <EvaluationResult result={lastEvaluation} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="history-view">
                    {history.length === 0 ? (
                        <div className="empty-history glass-card">
                            <p className="text-secondary">No historical evaluations found.</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((record) => (
                                <div key={record.id} className="history-item glass-card">
                                    <div className="history-info">
                                        <div className="history-main">
                                            <span className="history-file">{record.resume_filename || 'Resume.pdf'}</span>
                                            <span className="history-date">
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="history-summary">{record.summary.substring(0, 100)}...</div>
                                    </div>
                                    <div className="history-score">
                                        <div className={`score-badge ${record.match_score >= 70 ? 'good' : 'poor'}`}>
                                            {Math.round(record.match_score)}%
                                        </div>
                                        <button 
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => {
                                                setLastEvaluation(record as any);
                                                setActiveTab('analyzer');
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .ats-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: var(--spacing-xl);
                }

                .ats-header {
                    margin-bottom: var(--spacing-xl);
                    text-align: center;
                }

                .ats-tabs {
                    display: flex;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-xs);
                    margin-bottom: var(--spacing-xl);
                    max-width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                }

                .ats-tab {
                    padding: 8px 24px;
                    border: none;
                    background: transparent;
                    color: var(--text-tertiary);
                    font-weight: 600;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .ats-tab.active {
                    background: var(--accent-primary);
                    color: white;
                }

                .analyzer-form {
                    padding: var(--spacing-xl);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xl);
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .form-label {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: var(--text-primary);
                }

                .jd-textarea {
                    width: 100%;
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-md);
                    color: var(--text-primary);
                    font-family: inherit;
                    resize: vertical;
                }

                .form-actions {
                    display: flex;
                    justify-content: center;
                    padding-top: var(--spacing-md);
                }

                .error-box {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--accent-error);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-md);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    text-align: center;
                }

                .result-actions {
                    margin-bottom: var(--spacing-md);
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-lg);
                }

                .history-main {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xs);
                }

                .history-file {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .history-date {
                    font-size: 0.85rem;
                    color: var(--text-tertiary);
                }

                .history-summary {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    max-width: 600px;
                }

                .history-score {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-lg);
                }

                .score-badge {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.9rem;
                }

                .score-badge.good {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--accent-success);
                    border: 2px solid var(--accent-success);
                }

                .score-badge.poor {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--accent-error);
                    border: 2px solid var(--accent-error);
                }

                .spinner-sm {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                    margin-right: 8px;
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
