import { useMemo } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { scoreToLetterGrade } from '@/lib/evaluation';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import { ApplicationStatus } from '@/lib/types';

// ─── Mini bar chart component ──────────────────────────────────────────────

interface BarChartProps {
    data: { label: string; value: number; color: string }[];
    maxValue: number;
}

function BarChart({ data, maxValue }: BarChartProps) {
    return (
        <div className="bar-chart">
            {data.map(({ label, value, color }) => (
                <div key={label} className="bar-row">
                    <span className="bar-label">{label}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{
                                width: maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%',
                                background: color,
                            }}
                        />
                    </div>
                    <span className="bar-value">{value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Donut / ring chart (SVG) ──────────────────────────────────────────────

interface DonutSlice {
    label: string;
    value: number;
    color: string;
}

function DonutChart({ slices, size = 180 }: { slices: DonutSlice[]; size?: number }) {
    const total = slices.reduce((s, d) => s + d.value, 0);
    const r = size / 2 - 20;
    const cx = size / 2;
    const cy = size / 2;
    const stroke = 28;

    let cumulativeAngle = -Math.PI / 2;

    const arcs = slices.map((slice) => {
        const fraction = total > 0 ? slice.value / total : 0;
        const angle = fraction * 2 * Math.PI;
        const startAngle = cumulativeAngle;
        cumulativeAngle += angle;
        const endAngle = cumulativeAngle;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const large = angle > Math.PI ? 1 : 0;

        return { ...slice, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, fraction };
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* background ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={stroke} stroke="rgba(255,255,255,0.04)" />
            {arcs.map((arc) =>
                arc.fraction > 0 ? (
                    <path
                        key={arc.label}
                        d={arc.d}
                        fill="none"
                        strokeWidth={stroke}
                        stroke={arc.color}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                ) : null
            )}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontWeight="700">
                {total}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-tertiary)" fontSize="11">
                Total
            </text>
        </svg>
    );
}

// ─── Grade color map ───────────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = {
    A: 'var(--accent-success)',
    B: 'var(--accent-secondary)',
    C: 'var(--accent-warning)',
    D: 'var(--accent-error)',
    E: 'var(--accent-error)',
    F: 'var(--text-tertiary)',
};

// ─── Main page ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const { applications, loading } = useApplications();

    const stats = useMemo(() => {
        const total = applications.length;
        const byStatus = (['wishlist', 'applied', 'interview', 'offer', 'rejected'] as ApplicationStatus[]).map(
            (s) => ({
                status: s,
                count: applications.filter((a) => a.status === s).length,
            })
        );

        // Conversion rates
        const applied = byStatus.find((s) => s.status === 'applied')!.count;
        const interview = byStatus.find((s) => s.status === 'interview')!.count;
        const offer = byStatus.find((s) => s.status === 'offer')!.count;
        const rejected = byStatus.find((s) => s.status === 'rejected')!.count;
        const wishlist = byStatus.find((s) => s.status === 'wishlist')!.count;

        const interviewRate = applied + interview + offer + rejected > 0
            ? Math.round((interview / (applied + interview + offer + rejected)) * 100)
            : 0;
        const offerRate = interview > 0 ? Math.round((offer / interview) * 100) : 0;
        const successRate = total > 0 ? Math.round((offer / total) * 100) : 0;

        // Grade distribution (only for evaluated applications)
        const evaluated = applications.filter((a) => a.fit_score != null);
        const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
        for (const app of evaluated) {
            const grade = app.fit_grade ?? scoreToLetterGrade(app.fit_score!);
            gradeCounts[grade] = (gradeCounts[grade] ?? 0) + 1;
        }

        const avgFitScore =
            evaluated.length > 0
                ? evaluated.reduce((sum, a) => sum + a.fit_score!, 0) / evaluated.length
                : null;

        const recommendedCount = evaluated.filter((a) => a.recommend_apply).length;

        // Month over month (last 6 months)
        const now = new Date();
        const monthlyData: { label: string; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short' });
            const count = applications.filter((a) => {
                const created = new Date(a.created_at);
                return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
            }).length;
            monthlyData.push({ label, count });
        }
        const maxMonthly = Math.max(...monthlyData.map((m) => m.count), 1);

        return {
            total, byStatus, wishlist, applied, interview, offer, rejected,
            interviewRate, offerRate, successRate,
            gradeCounts, evaluated, avgFitScore, recommendedCount,
            monthlyData, maxMonthly,
        };
    }, [applications]);

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="analytics-loading">
                    <div className="spinner" />
                    <p className="text-secondary">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const statusDonutSlices = stats.byStatus.map((s) => ({
        label: STATUS_LABELS[s.status],
        value: s.count,
        color: STATUS_COLORS[s.status],
    }));

    const gradeBarData = Object.entries(stats.gradeCounts)
        .filter(([, v]) => v > 0)
        .map(([grade, count]) => ({
            label: `Grade ${grade}`,
            value: count,
            color: GRADE_COLORS[grade],
        }));

    const maxGrade = Math.max(...Object.values(stats.gradeCounts), 1);

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p className="text-secondary">Pipeline health, grade distribution, and success metrics</p>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-strip">
                <div className="kpi-card glass-card">
                    <span className="kpi-icon">📋</span>
                    <span className="kpi-value">{stats.total}</span>
                    <span className="kpi-label">Total Applications</span>
                </div>
                <div className="kpi-card glass-card">
                    <span className="kpi-icon">🎤</span>
                    <span className="kpi-value" style={{ color: 'var(--accent-secondary)' }}>
                        {stats.interviewRate}%
                    </span>
                    <span className="kpi-label">Interview Rate</span>
                </div>
                <div className="kpi-card glass-card">
                    <span className="kpi-icon">🏆</span>
                    <span className="kpi-value" style={{ color: 'var(--accent-success)' }}>
                        {stats.offerRate}%
                    </span>
                    <span className="kpi-label">Interview → Offer</span>
                </div>
                <div className="kpi-card glass-card">
                    <span className="kpi-icon">⭐</span>
                    <span className="kpi-value" style={{ color: 'var(--accent-primary)' }}>
                        {stats.avgFitScore != null ? stats.avgFitScore.toFixed(2) : '—'}
                    </span>
                    <span className="kpi-label">Avg Fit Score</span>
                </div>
                <div className="kpi-card glass-card">
                    <span className="kpi-icon">✨</span>
                    <span className="kpi-value" style={{ color: 'var(--accent-warning)' }}>
                        {stats.recommendedCount}
                    </span>
                    <span className="kpi-label">AI Recommended</span>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Pipeline Status Donut */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Pipeline Status</h3>
                    <p className="chart-subtitle text-secondary">Distribution across all stages</p>
                    <div className="donut-section">
                        <DonutChart slices={statusDonutSlices} size={200} />
                        <div className="donut-legend">
                            {stats.byStatus.map((s) => (
                                <div key={s.status} className="legend-row">
                                    <span
                                        className="legend-dot"
                                        style={{ background: STATUS_COLORS[s.status] }}
                                    />
                                    <span className="legend-label">{STATUS_LABELS[s.status]}</span>
                                    <span className="legend-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Volume */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Monthly Volume</h3>
                    <p className="chart-subtitle text-secondary">Applications added per month</p>
                    <div className="monthly-chart">
                        {stats.monthlyData.map((m) => (
                            <div key={m.label} className="monthly-bar-col">
                                <span className="monthly-count">{m.count}</span>
                                <div className="monthly-bar-track">
                                    <div
                                        className="monthly-bar-fill"
                                        style={{
                                            height: `${(m.count / stats.maxMonthly) * 100}%`,
                                        }}
                                    />
                                </div>
                                <span className="monthly-label">{m.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Conversion Funnel</h3>
                    <p className="chart-subtitle text-secondary">How far applications progress</p>
                    <div className="funnel-steps">
                        {[
                            { label: 'Wishlist', value: stats.wishlist, color: STATUS_COLORS.wishlist },
                            { label: 'Applied', value: stats.applied, color: STATUS_COLORS.applied },
                            { label: 'Interview', value: stats.interview, color: STATUS_COLORS.interview },
                            { label: 'Offer', value: stats.offer, color: STATUS_COLORS.offer },
                        ].map((step, idx, arr) => {
                            const prev = arr[idx - 1];
                            const pct = prev && prev.value > 0 ? Math.round((step.value / prev.value) * 100) : null;
                            return (
                                <div key={step.label} className="funnel-step">
                                    <div
                                        className="funnel-step-bar"
                                        style={{
                                            width: `${100 - idx * 12}%`,
                                            background: step.color,
                                            opacity: 0.85,
                                        }}
                                    >
                                        <span className="funnel-step-label">{step.label}</span>
                                        <span className="funnel-step-count">{step.value}</span>
                                    </div>
                                    {pct !== null && (
                                        <span className="funnel-conversion">↓ {pct}%</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">AI Grade Distribution</h3>
                    <p className="chart-subtitle text-secondary">
                        {stats.evaluated.length} of {stats.total} applications evaluated
                    </p>
                    {gradeBarData.length === 0 ? (
                        <p className="empty-msg text-tertiary">No evaluated applications yet</p>
                    ) : (
                        <BarChart data={gradeBarData} maxValue={maxGrade} />
                    )}
                </div>

                {/* Success Metrics */}
                <div className="chart-card glass-card metrics-card">
                    <h3 className="chart-title">Success Metrics</h3>
                    <p className="chart-subtitle text-secondary">Key performance indicators</p>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <div className="metric-ring" style={{ '--ring-pct': `${stats.successRate}` } as React.CSSProperties}>
                                <svg viewBox="0 0 80 80" width="80" height="80">
                                    <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                                    <circle
                                        cx="40" cy="40" r="32"
                                        fill="none" strokeWidth="8"
                                        stroke="var(--accent-success)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 32 * stats.successRate / 100} ${2 * Math.PI * 32}`}
                                        transform="rotate(-90 40 40)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }}
                                    />
                                    <text x="40" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">
                                        {stats.successRate}%
                                    </text>
                                </svg>
                            </div>
                            <span className="metric-label">Overall Success</span>
                        </div>
                        <div className="metric-item">
                            <div className="metric-ring">
                                <svg viewBox="0 0 80 80" width="80" height="80">
                                    <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                                    <circle
                                        cx="40" cy="40" r="32"
                                        fill="none" strokeWidth="8"
                                        stroke="var(--accent-secondary)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 32 * stats.interviewRate / 100} ${2 * Math.PI * 32}`}
                                        transform="rotate(-90 40 40)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }}
                                    />
                                    <text x="40" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">
                                        {stats.interviewRate}%
                                    </text>
                                </svg>
                            </div>
                            <span className="metric-label">Interview Rate</span>
                        </div>
                        <div className="metric-item">
                            <div className="metric-ring">
                                <svg viewBox="0 0 80 80" width="80" height="80">
                                    <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                                    <circle
                                        cx="40" cy="40" r="32"
                                        fill="none" strokeWidth="8"
                                        stroke="var(--accent-warning)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 32 * stats.offerRate / 100} ${2 * Math.PI * 32}`}
                                        transform="rotate(-90 40 40)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }}
                                    />
                                    <text x="40" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">
                                        {stats.offerRate}%
                                    </text>
                                </svg>
                            </div>
                            <span className="metric-label">Offer Rate</span>
                        </div>
                        <div className="metric-item">
                            <div className="metric-ring">
                                <svg viewBox="0 0 80 80" width="80" height="80">
                                    <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                                    <circle
                                        cx="40" cy="40" r="32"
                                        fill="none" strokeWidth="8"
                                        stroke="var(--accent-primary)"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 32 * (stats.evaluated.length / Math.max(stats.total, 1)) * 100 / 100} ${2 * Math.PI * 32}`}
                                        transform="rotate(-90 40 40)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }}
                                    />
                                    <text x="40" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">
                                        {stats.total > 0 ? Math.round((stats.evaluated.length / stats.total) * 100) : 0}%
                                    </text>
                                </svg>
                            </div>
                            <span className="metric-label">AI Evaluated</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .analytics-container {
                    padding: var(--spacing-xl);
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .analytics-header {
                    margin-bottom: var(--spacing-xl);
                }

                .analytics-header h1 {
                    margin-bottom: var(--spacing-xs);
                }

                .analytics-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                    gap: var(--spacing-md);
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--glass-border);
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                /* KPI Strip */
                .kpi-strip {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-xl);
                }

                .kpi-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: var(--spacing-lg);
                    gap: var(--spacing-xs);
                }

                .kpi-icon {
                    font-size: 1.5rem;
                    margin-bottom: var(--spacing-xs);
                }

                .kpi-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .kpi-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* Analytics Grid */
                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-xl);
                }

                .chart-card {
                    padding: var(--spacing-xl);
                }

                .chart-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xs);
                }

                .chart-subtitle {
                    font-size: 0.8rem;
                    margin-bottom: var(--spacing-lg);
                }

                /* Donut */
                .donut-section {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xl);
                    flex-wrap: wrap;
                }

                .donut-legend {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .legend-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    font-size: 0.875rem;
                }

                .legend-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .legend-label {
                    flex: 1;
                    color: var(--text-secondary);
                }

                .legend-count {
                    font-weight: 700;
                    color: var(--text-primary);
                    min-width: 24px;
                    text-align: right;
                }

                /* Monthly bar chart */
                .monthly-chart {
                    display: flex;
                    align-items: flex-end;
                    gap: var(--spacing-sm);
                    height: 160px;
                    padding-top: var(--spacing-md);
                }

                .monthly-bar-col {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    gap: var(--spacing-xs);
                }

                .monthly-count {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    min-height: 1rem;
                }

                .monthly-bar-track {
                    flex: 1;
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: flex-end;
                    overflow: hidden;
                }

                .monthly-bar-fill {
                    width: 100%;
                    background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary));
                    border-radius: var(--radius-sm);
                    transition: height 0.8s ease;
                    min-height: 2px;
                }

                .monthly-label {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                }

                /* Funnel */
                .funnel-steps {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                    align-items: center;
                }

                .funnel-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }

                .funnel-step-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius-md);
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: width 0.6s ease;
                }

                .funnel-step-label { flex: 1; }
                .funnel-step-count { font-weight: 700; }

                .funnel-conversion {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    margin: 2px 0;
                }

                /* Bar Chart */
                .bar-chart {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .bar-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .bar-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    width: 70px;
                    flex-shrink: 0;
                }

                .bar-track {
                    flex: 1;
                    height: 10px;
                    background: rgba(255,255,255,0.05);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    border-radius: var(--radius-sm);
                    transition: width 0.8s ease;
                }

                .bar-value {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    width: 28px;
                    text-align: right;
                }

                /* Success Metrics rings */
                .metrics-card { grid-column: span 2; }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-xl);
                }

                .metric-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .metric-ring {
                    filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.2));
                }

                .metric-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-align: center;
                }

                .empty-msg {
                    font-size: 0.875rem;
                    text-align: center;
                    padding: var(--spacing-xl) 0;
                }

                @media (max-width: 1024px) {
                    .kpi-strip {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .metrics-card { grid-column: span 1; }
                    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 768px) {
                    .analytics-container { padding: var(--spacing-md); }
                    .kpi-strip { grid-template-columns: repeat(2, 1fr); }
                    .analytics-grid { grid-template-columns: 1fr; }
                    .metrics-card { grid-column: span 1; }
                    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
                    .donut-section { flex-direction: column; }
                }
            `}</style>
        </div>
    );
}
