import { useState, useMemo } from 'react';
import { useReminders } from '@/hooks/useReminders';
import { useApplications } from '@/hooks/useApplications';
import { Reminder, ReminderFormData } from '@/lib/types';
import Modal from '@/components/Modal';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

// ─── Reminder Form ─────────────────────────────────────────────────────────

interface ReminderFormProps {
    isOpen: boolean;
    onClose: () => void;
    reminder?: Reminder;
    onSave: (data: ReminderFormData) => Promise<void>;
    applicationOptions: { id: string; label: string }[];
}

function ReminderFormModal({ isOpen, onClose, reminder, onSave, applicationOptions }: ReminderFormProps) {
    const [title, setTitle] = useState(reminder?.title ?? '');
    const [dueDate, setDueDate] = useState(
        reminder?.due_date ? reminder.due_date.slice(0, 16) : ''
    );
    const [applicationId, setApplicationId] = useState(reminder?.application_id ?? '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) return;
        setSaving(true);
        setError(null);
        try {
            await onSave({
                title: title.trim(),
                due_date: new Date(dueDate).toISOString(),
                application_id: applicationId || undefined,
                completed: reminder?.completed ?? false,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save reminder');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={reminder ? 'Edit Reminder' : 'New Reminder'}>
            <form className="reminder-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="reminder-title">Title *</label>
                    <input
                        id="reminder-title"
                        className="form-input"
                        type="text"
                        placeholder="e.g. Follow up with recruiter"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reminder-due">Due Date &amp; Time *</label>
                    <input
                        id="reminder-due"
                        className="form-input"
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reminder-app">Linked Application (optional)</label>
                    <select
                        id="reminder-app"
                        className="form-select"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                    >
                        <option value="">— None —</option>
                        {applicationOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : reminder ? 'Save Changes' : 'Create Reminder'}
                    </button>
                </div>
            </form>

            <style>{`
                .reminder-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-md);
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--glass-border);
                }
            `}</style>
        </Modal>
    );
}

// ─── Due date badge helpers ────────────────────────────────────────────────

function dueBadge(due: string, completed: boolean) {
    if (completed) return { label: 'Done', cls: 'due-done' };
    const d = new Date(due);
    if (isPast(d) && !isToday(d)) return { label: 'Overdue', cls: 'due-overdue' };
    if (isToday(d)) return { label: 'Today', cls: 'due-today' };
    if (isTomorrow(d)) return { label: 'Tomorrow', cls: 'due-soon' };
    const days = differenceInDays(d, new Date());
    if (days <= 7) return { label: `In ${days}d`, cls: 'due-soon' };
    return { label: `In ${days}d`, cls: 'due-future' };
}

// ─── Main page ─────────────────────────────────────────────────────────────

type FilterTab = 'upcoming' | 'today' | 'overdue' | 'completed' | 'all';

export default function RemindersPage() {
    const { reminders, loading, createReminder, updateReminder, toggleComplete, deleteReminder } = useReminders();
    const { applications } = useApplications();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();
    const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

    const applicationOptions = useMemo(
        () =>
            applications.map((a) => ({
                id: a.id,
                label: `${a.position} @ ${a.company?.name ?? 'Unknown'}`,
            })),
        [applications]
    );

    const filtered = useMemo(() => {
        const now = new Date();
        return reminders.filter((r) => {
            const d = new Date(r.due_date);
            switch (activeTab) {
                case 'upcoming':
                    return !r.completed && (d >= now || isToday(d));
                case 'today':
                    return isToday(d) && !r.completed;
                case 'overdue':
                    return isPast(d) && !isToday(d) && !r.completed;
                case 'completed':
                    return r.completed;
                case 'all':
                    return true;
            }
        });
    }, [reminders, activeTab]);

    const counts = useMemo(() => {
        const now = new Date();
        return {
            upcoming: reminders.filter((r) => !r.completed && new Date(r.due_date) >= now).length,
            today: reminders.filter((r) => isToday(new Date(r.due_date)) && !r.completed).length,
            overdue: reminders.filter((r) => isPast(new Date(r.due_date)) && !isToday(new Date(r.due_date)) && !r.completed).length,
            completed: reminders.filter((r) => r.completed).length,
            all: reminders.length,
        };
    }, [reminders]);

    const handleSave = async (data: ReminderFormData) => {
        if (editingReminder) {
            await updateReminder(editingReminder.id, data);
        } else {
            await createReminder(data);
        }
    };

    const handleEdit = (r: Reminder) => {
        setEditingReminder(r);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingReminder(undefined);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this reminder?')) {
            await deleteReminder(id);
        }
    };

    const TABS: { id: FilterTab; label: string }[] = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'today', label: 'Today' },
        { id: 'overdue', label: 'Overdue' },
        { id: 'completed', label: 'Completed' },
        { id: 'all', label: 'All' },
    ];

    if (loading) {
        return (
            <div className="rem-container">
                <div className="rem-loading">
                    <div className="spinner" />
                    <p className="text-secondary">Loading reminders…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rem-container">
            {/* Header */}
            <div className="rem-header">
                <div>
                    <h1>Reminders</h1>
                    <p className="text-secondary">Stay on top of follow-ups, deadlines, and interviews</p>
                </div>
                <button
                    id="new-reminder-btn"
                    className="btn btn-primary"
                    onClick={() => { setEditingReminder(undefined); setIsFormOpen(true); }}
                >
                    <span>＋</span>
                    <span>New Reminder</span>
                </button>
            </div>

            {/* Summary strip */}
            <div className="rem-summary">
                <div className="rem-stat glass-card">
                    <span className="rem-stat-value">{counts.upcoming}</span>
                    <span className="rem-stat-label">Upcoming</span>
                </div>
                <div className="rem-stat glass-card overdue-stat">
                    <span className="rem-stat-value">{counts.overdue}</span>
                    <span className="rem-stat-label">Overdue</span>
                </div>
                <div className="rem-stat glass-card today-stat">
                    <span className="rem-stat-value">{counts.today}</span>
                    <span className="rem-stat-label">Due Today</span>
                </div>
                <div className="rem-stat glass-card done-stat">
                    <span className="rem-stat-value">{counts.completed}</span>
                    <span className="rem-stat-label">Completed</span>
                </div>
            </div>

            {reminders.length === 0 ? (
                <div className="rem-empty glass-card">
                    <div className="rem-empty-icon">🔔</div>
                    <h2>No reminders yet</h2>
                    <p className="text-secondary">
                        Create reminders to follow up on applications, prepare for interviews, or track deadlines.
                    </p>
                    <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                        Create your first reminder
                    </button>
                </div>
            ) : (
                <>
                    {/* Tab bar */}
                    <div className="rem-tabs glass-card">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                className={`rem-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                <span className={`tab-count ${tab.id === 'overdue' && counts.overdue > 0 ? 'overdue-count' : ''}`}>
                                    {counts[tab.id]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Reminders list */}
                    {filtered.length === 0 ? (
                        <div className="rem-empty-filter glass-card">
                            <p className="text-secondary">
                                {activeTab === 'overdue' ? '🎉 No overdue reminders!' :
                                 activeTab === 'today' ? '✅ Nothing due today.' :
                                 activeTab === 'completed' ? 'No completed reminders yet.' :
                                 'No reminders in this category.'}
                            </p>
                        </div>
                    ) : (
                        <div className="rem-list">
                            {filtered.map((reminder) => {
                                const badge = dueBadge(reminder.due_date, reminder.completed);
                                const appName = reminder.application
                                    ? `${(reminder.application as unknown as { position: string; company?: { name: string } }).position} @ ${(reminder.application as unknown as { position: string; company?: { name: string } }).company?.name ?? ''}`
                                    : null;

                                return (
                                    <div
                                        key={reminder.id}
                                        className={`rem-item glass-card ${reminder.completed ? 'completed' : ''}`}
                                    >
                                        {/* Checkbox */}
                                        <button
                                            className={`rem-checkbox ${reminder.completed ? 'checked' : ''}`}
                                            onClick={() => toggleComplete(reminder.id, !reminder.completed)}
                                            title={reminder.completed ? 'Mark incomplete' : 'Mark complete'}
                                            aria-label={reminder.completed ? 'Mark incomplete' : 'Mark complete'}
                                        >
                                            {reminder.completed ? '✓' : ''}
                                        </button>

                                        {/* Content */}
                                        <div className="rem-content">
                                            <div className="rem-title-row">
                                                <span className={`rem-title ${reminder.completed ? 'strikethrough' : ''}`}>
                                                    {reminder.title}
                                                </span>
                                                <span className={`due-badge ${badge.cls}`}>{badge.label}</span>
                                            </div>
                                            <div className="rem-meta">
                                                <span className="rem-date">
                                                    🗓 {format(new Date(reminder.due_date), 'MMM dd, yyyy · h:mm a')}
                                                </span>
                                                {appName && (
                                                    <span className="rem-app-link">
                                                        📎 {appName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="rem-actions">
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => handleEdit(reminder)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => handleDelete(reminder.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <ReminderFormModal
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    reminder={editingReminder}
                    onSave={handleSave}
                    applicationOptions={applicationOptions}
                />
            )}

            <style>{`
                .rem-container {
                    padding: var(--spacing-xl);
                    max-width: 900px;
                    margin: 0 auto;
                }

                .rem-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--spacing-xl);
                    gap: var(--spacing-md);
                }

                .rem-header h1 { margin-bottom: var(--spacing-xs); }

                .rem-header .btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    flex-shrink: 0;
                }

                /* Summary strip */
                .rem-summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .rem-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: var(--spacing-lg);
                    text-align: center;
                    gap: var(--spacing-xs);
                }

                .rem-stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-primary);
                }

                .rem-stat-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .overdue-stat .rem-stat-value { color: var(--accent-error); }
                .today-stat .rem-stat-value { color: var(--accent-warning); }
                .done-stat .rem-stat-value { color: var(--accent-success); }

                /* Tabs */
                .rem-tabs {
                    display: flex;
                    gap: 0;
                    padding: var(--spacing-xs);
                    margin-bottom: var(--spacing-lg);
                    border-radius: var(--radius-xl);
                }

                .rem-tab {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: transparent;
                    border: none;
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-base);
                }

                .rem-tab:hover {
                    color: var(--text-primary);
                    background: rgba(255,255,255,0.05);
                }

                .rem-tab.active {
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    color: white;
                    font-weight: 600;
                }

                .tab-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 20px;
                    height: 20px;
                    padding: 0 6px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    background: rgba(255,255,255,0.1);
                }

                .rem-tab.active .tab-count {
                    background: rgba(255,255,255,0.25);
                }

                .overdue-count {
                    background: var(--accent-error) !important;
                    color: white;
                }

                /* Reminder list */
                .rem-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .rem-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-lg);
                    transition: all var(--transition-base);
                }

                .rem-item.completed {
                    opacity: 0.55;
                }

                /* Checkbox */
                .rem-checkbox {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                    border-radius: 50%;
                    border: 2px solid var(--glass-border);
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: white;
                    transition: all var(--transition-base);
                }

                .rem-checkbox:hover {
                    border-color: var(--accent-primary);
                    background: rgba(168, 85, 247, 0.1);
                }

                .rem-checkbox.checked {
                    background: var(--accent-success);
                    border-color: var(--accent-success);
                }

                /* Content */
                .rem-content {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }

                .rem-title-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    flex-wrap: wrap;
                }

                .rem-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                }

                .rem-title.strikethrough {
                    text-decoration: line-through;
                    color: var(--text-tertiary);
                }

                .rem-meta {
                    display: flex;
                    gap: var(--spacing-lg);
                    flex-wrap: wrap;
                }

                .rem-date, .rem-app-link {
                    font-size: 0.8rem;
                    color: var(--text-tertiary);
                }

                /* Due badges */
                .due-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 8px;
                    border-radius: 999px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .due-overdue {
                    background: rgba(220, 60, 60, 0.15);
                    color: var(--accent-error);
                    border: 1px solid rgba(220, 60, 60, 0.3);
                }

                .due-today {
                    background: rgba(255, 200, 0, 0.15);
                    color: var(--accent-warning);
                    border: 1px solid rgba(255, 200, 0, 0.3);
                }

                .due-soon {
                    background: rgba(59, 130, 246, 0.12);
                    color: var(--accent-secondary);
                    border: 1px solid rgba(59, 130, 246, 0.25);
                }

                .due-future {
                    background: rgba(255,255,255,0.05);
                    color: var(--text-tertiary);
                    border: 1px solid var(--glass-border);
                }

                .due-done {
                    background: rgba(0, 230, 100, 0.1);
                    color: var(--accent-success);
                    border: 1px solid rgba(0, 230, 100, 0.2);
                }

                /* Actions */
                .rem-actions {
                    display: flex;
                    gap: var(--spacing-xs);
                    opacity: 0;
                    transition: opacity var(--transition-fast);
                    flex-shrink: 0;
                }

                .rem-item:hover .rem-actions { opacity: 1; }

                /* Empty states */
                .rem-empty {
                    text-align: center;
                    padding: var(--spacing-2xl);
                    max-width: 480px;
                    margin: var(--spacing-xl) auto;
                }

                .rem-empty-icon {
                    font-size: 4rem;
                    margin-bottom: var(--spacing-lg);
                }

                .rem-empty h2 { margin-bottom: var(--spacing-md); }

                .rem-empty p { margin-bottom: var(--spacing-lg); }

                .rem-empty-filter {
                    text-align: center;
                    padding: var(--spacing-xl);
                }

                /* Loading */
                .rem-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
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

                @media (max-width: 768px) {
                    .rem-container { padding: var(--spacing-md); }
                    .rem-summary { grid-template-columns: repeat(2, 1fr); }
                    .rem-header { flex-direction: column; align-items: stretch; }
                    .rem-tabs { flex-wrap: wrap; }
                    .rem-tab { flex: none; }
                }
            `}</style>
        </div>
    );
}
