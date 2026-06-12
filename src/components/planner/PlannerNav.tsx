import { format, startOfWeek, endOfWeek } from 'date-fns';

interface PlannerNavProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  progressPercent: number;
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 10.5S1.5 7.25 1.5 4.5a2.25 2.25 0 0 1 4.125-1.2A2.25 2.25 0 0 1 6 4.05a2.25 2.25 0 0 1 .375-1.275A2.25 2.25 0 0 1 10.5 4.5C10.5 7.25 6 10.5 6 10.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6h7M5 3.5 2.5 6 5 8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlannerNav({
  weekStart,
  onPrevWeek,
  onNextWeek,
  progressPercent,
}: PlannerNavProps) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const rangeLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;

  return (
    <>
      <header className="planner-nav">
        <div className="planner-nav__left">
          <a href="/planner" className="planner-logo" aria-label="planner home">
            planner<span className="planner-logo__dot">.</span>
          </a>
        </div>

        <div className="planner-nav__center">
          <span className="planner-section-label">Planning for</span>
          <div className="planner-date-picker">
            <button type="button" className="planner-icon-btn" onClick={onPrevWeek} aria-label="Previous week">
              <ChevronLeftIcon />
            </button>
            <span className="planner-date-picker__range">{rangeLabel}</span>
            <button type="button" className="planner-icon-btn" onClick={onNextWeek} aria-label="Next week">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="planner-nav__right">
          <button type="button" className="planner-support-btn">
            <HeartIcon />
            Support
          </button>
          <span className="planner-guest-status">Guest · Saved locally</span>
          <div className="planner-nav-actions">
            <button type="button" className="planner-pill-btn">Sign in</button>
            <button type="button" className="planner-pill-btn">Stats</button>
            <button type="button" className="planner-pill-btn">Archive</button>
            <button type="button" className="planner-pill-btn">
              End week
              <ReturnIcon />
            </button>
          </div>
        </div>
      </header>

      <div className="planner-progress-strip" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <div className="planner-progress-strip__track">
          <div
            className="planner-progress-strip__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </>
  );
}

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}
