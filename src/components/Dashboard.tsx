import type { DayId, UserProgress } from '../types';
import { DAYS } from '../data/days';
import { trackEvent, Events } from '../utils/analytics';

interface DashboardProps {
  progress: UserProgress;
  onSelectDay: (dayId: DayId) => void;
  onComparison: () => void;
  onCompletion: () => void;
}

function StreakBar({ completed }: { completed: DayId[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {([1, 2, 3, 4, 5, 6, 7] as DayId[]).map((d) => (
        <div
          key={d}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            completed.includes(d)
              ? 'bg-accent'
              : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export function Dashboard({
  progress,
  onSelectDay,
  onComparison,
  onCompletion,
}: DashboardProps) {
  const isAllComplete = progress.completedDays.length === 7;

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-light text-text-primary">AHA Reset™</h1>
            <span className="text-xs text-text-muted">
              Day {progress.currentDay} of 7
            </span>
          </div>

          {/* Progress bar */}
          <StreakBar completed={progress.completedDays} />

          <p className="text-xs text-text-muted mt-2">
            {progress.completedDays.length === 0
              ? 'Day 1 is waiting for you.'
              : `${progress.completedDays.length} day${progress.completedDays.length > 1 ? 's' : ''} complete`}
          </p>
        </div>
      </header>

      {/* Day cards */}
      <main className="flex-1 px-6 pb-20">
        <div className="max-w-lg mx-auto w-full space-y-2">
          {DAYS.map((day) => {
            const isCompleted = progress.completedDays.includes(day.day);
            const isCurrent = day.day === progress.currentDay;
            const isLocked = !isCompleted && !isCurrent &&
              !progress.completedDays.includes((day.day - 1) as DayId) && day.day !== 1;

            return (
              <button
                key={day.day}
                onClick={() => {
                  if (!isLocked) {
                    trackEvent(Events.DAY_VIEW(day.day), { day: day.day });
                    onSelectDay(day.day);
                  }
                }}
                disabled={isLocked}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent/8 border-accent/15'
                    : isCurrent
                      ? 'bg-surface border-accent/30 animate-glow'
                      : isLocked
                        ? 'bg-surface/30 border-border/50 opacity-40'
                        : 'bg-surface border-border hover:border-border-light'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Status */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-accent border-accent'
                          : isCurrent
                            ? 'border-accent/40'
                            : 'border-border'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-[#121214] text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-text-muted text-xs">{day.day}</span>
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? 'text-accent line-through'
                            : isCurrent
                              ? 'text-text-primary'
                              : 'text-text-secondary'
                        }`}
                      >
                        {day.theme}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {day.themeSub}
                      </p>
                    </div>
                  </div>

                  <svg
                    className={`w-4 h-4 ${isCompleted ? 'text-accent' : 'text-text-muted'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8">
        <div className="max-w-lg mx-auto w-full space-y-2">
          {progress.completedDays.length >= 1 && (
            <button
              onClick={() => {
                trackEvent(Events.COMPARISON_VIEW);
                onComparison();
              }}
              className="w-full py-3 px-4 text-xs text-text-muted border border-border rounded-xl
                hover:text-text-secondary hover:border-border-light transition-all duration-300"
            >
              Where you started vs. where you are
            </button>
          )}
          {isAllComplete && (
            <button
              onClick={() => {
                trackEvent(Events.COMPLETION_VIEW);
                onCompletion();
              }}
              className="w-full py-3.5 px-4 bg-accent/10 border border-accent/20 text-accent text-sm font-medium rounded-xl
                hover:bg-accent/15 transition-all duration-300"
            >
              View your completion card
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
