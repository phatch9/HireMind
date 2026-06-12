import { useCallback, useMemo, useState } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import PlannerNav, { getWeekStart } from './PlannerNav';
import ProjectsPanel from './ProjectsPanel';
import WeekPanel from './WeekPanel';
import { DAY_ORDER, type DayKey, type PlannerProject } from './types';
import './planner.css';

const INITIAL_PROJECTS: PlannerProject[] = [
  {
    id: 'p1',
    title: 'Making clear progress for upcoming launch',
    tasks: [
      { id: 't1', label: 'My joke project', completed: false },
      {
        id: 't2',
        label: 'test',
        completed: false,
        dueDate: 'Jun 15',
        subCount: { done: 0, total: 1 },
      },
    ],
  },
  {
    id: 'p2',
    title: 'test project name1',
    tasks: [],
  },
];

const EMPTY_JOURNAL: Record<DayKey, string> = {
  mon: '',
  tue: '',
  wed: '',
  thu: '',
  fri: '',
  sat: '',
  sun: '',
};

export default function PlannerDashboard() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [projects, setProjects] = useState<PlannerProject[]>(INITIAL_PROJECTS);
  const [activeDay, setActiveDay] = useState<DayKey>('fri');
  const [journalEntries, setJournalEntries] = useState<Record<DayKey, string>>(EMPTY_JOURNAL);
  const [showAllDays, setShowAllDays] = useState(false);

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const allTasks = projects.flatMap((p) => p.tasks);
    const completed = allTasks.filter((t) => t.completed).length;
    const total = allTasks.length;
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [projects]);

  const daysWithActivity = useMemo(() => {
    const active = new Set<DayKey>();
    DAY_ORDER.forEach((day) => {
      if (journalEntries[day].trim().length > 0) {
        active.add(day);
      }
    });
    if (projects.some((p) => p.tasks.some((t) => t.dueDate))) {
      active.add('mon');
    }
    return active;
  }, [journalEntries, projects]);

  const handleToggleTask = useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task,
              ),
            }
          : project,
      ),
    );
  }, []);

  const handleJournalChange = useCallback((day: DayKey, value: string) => {
    setJournalEntries((prev) => ({ ...prev, [day]: value }));
  }, []);

  return (
    <div className="planner-dashboard">
      <PlannerNav
        weekStart={weekStart}
        onPrevWeek={() => setWeekStart((d) => subWeeks(d, 1))}
        onNextWeek={() => setWeekStart((d) => addWeeks(d, 1))}
        progressPercent={progressPercent}
      />

      <main className="planner-main">
        <ProjectsPanel projects={projects} onToggleTask={handleToggleTask} />
        <WeekPanel
          activeDay={activeDay}
          onDayChange={setActiveDay}
          journalEntries={journalEntries}
          onJournalChange={handleJournalChange}
          showAllDays={showAllDays}
          onToggleShowAll={() => setShowAllDays((v) => !v)}
          daysWithActivity={daysWithActivity}
          completedCount={completedCount}
          totalCount={totalCount}
        />
      </main>
    </div>
  );
}
