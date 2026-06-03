import { AtsAnalysisResponse } from '../../lib/types';

interface EvaluationResultProps {
    result: AtsAnalysisResponse;
}

export default function EvaluationResult({ result }: EvaluationResultProps) {
    const {
        match_score,
        missing_keywords,
        present_keywords,
        recommendations,
        summary
    } = result;

    const scoreColor = 
        match_score >= 80 ? 'var(--accent-success)' :
        match_score >= 60 ? 'var(--accent-warning)' :
        'var(--accent-error)';

    return (
        <div className="evaluation-result">
            <div className="eval-header glass-card">
                <div className="score-section">
                    <div className="score-ring-container">
                        <svg className="score-ring" viewBox="0 0 100 100">
                            <circle className="ring-bg" cx="50" cy="50" r="45" />
                            <circle 
                                className="ring-fill" 
                                cx="50" 
                                cy="50" 
                                r="45" 
                                style={{ 
                                    strokeDasharray: `${(match_score / 100) * 283} 283`,
                                    stroke: scoreColor
                                }} 
                            />
                        </svg>
                        <div className="score-text">
                            <span className="score-value">{Math.round(match_score)}%</span>
                            <span className="score-label">Match</span>
                        </div>
                    </div>
                </div>
                <div className="summary-section">
                    <h3>Analysis Summary</h3>
                    <p className="summary-text">{summary}</p>
                </div>
            </div>

            <div className="eval-grid">
                <div className="eval-col glass-card">
                    <h3>
                        <span className="icon">✅</span>
                        Matching Keywords
                    </h3>
                    <div className="badge-cloud">
                        {present_keywords.length > 0 ? (
                            present_keywords.map((kw, i) => (
                                <span key={i} className="badge badge-success">{kw}</span>
                            ))
                        ) : (
                            <p className="text-secondary italic">No matching keywords identified.</p>
                        )}
                    </div>
                </div>

                <div className="eval-col glass-card">
                    <h3>
                        <span className="icon">❌</span>
                        Missing Keywords
                    </h3>
                    <div className="badge-cloud">
                        {missing_keywords.length > 0 ? (
                            missing_keywords.map((kw, i) => (
                                <span key={i} className="badge badge-error">{kw}</span>
                            ))
                        ) : (
                            <p className="text-secondary italic">Perfect keyword match!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="recommendations-section glass-card">
                <h3>
                    <span className="icon">💡</span>
                    Tailoring Recommendations
                </h3>
                <ul className="recommendations-list">
                    {recommendations.map((rec, i) => (
                        <li key={i} className="recommendation-item">
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>

            <style>{`
                .evaluation-result {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                    animation: fadeIn 0.5s ease-out;
                }

                .eval-header {
                    display: flex;
                    gap: var(--spacing-xl);
                    align-items: center;
                    padding: var(--spacing-xl);
                }

                .score-ring-container {
                    position: relative;
                    width: 120px;
                    height: 120px;
                }

                .score-ring {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .ring-bg {
                    fill: none;
                    stroke: var(--glass-border);
                    stroke-width: 8;
                }

                .ring-fill {
                    fill: none;
                    stroke-width: 8;
                    stroke-linecap: round;
                    transition: stroke-dasharray 1s ease-in-out;
                }

                .score-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .score-value {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-primary);
                }

                .score-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-tertiary);
                }

                .summary-section { flex: 1; }
                .summary-section h3 { margin-bottom: var(--spacing-sm); }
                .summary-text { line-height: 1.6; color: var(--text-secondary); }

                .eval-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-lg);
                }

                .eval-col h3 {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                    font-size: 1.1rem;
                }

                .badge-cloud {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xs);
                }

                .badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .badge-success {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--accent-success);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .badge-error {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--accent-error);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .recommendations-section h3 {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .recommendations-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .recommendation-item {
                    position: relative;
                    padding-left: var(--spacing-lg);
                    line-height: 1.5;
                    color: var(--text-secondary);
                }

                .recommendation-item::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--accent-primary);
                    font-weight: bold;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .eval-header { flex-direction: column; text-align: center; }
                    .eval-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
