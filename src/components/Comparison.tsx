import type { UserProgress } from '../types';
import { DAYS } from '../data/days';

interface ComparisonProps {
  progress: UserProgress;
  onBack: () => void;
}

export function Comparison({ progress, onBack }: ComparisonProps) {
  const day1 = DAYS[0];
  const day7 = DAYS[6];
  const day1Entry = progress.journalEntries.find((e) => e.dayId === 1);
  const day7Entry = progress.journalEntries.find((e) => e.dayId === 7);

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col">
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to your reset
          </button>

          <h1 className="text-2xl font-light text-text-primary">Where you started vs. where you are</h1>
          <p className="text-sm text-text-muted mt-1">Day 1 → Day 7 comparison</p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-20">
        <div className="max-w-lg mx-auto w-full space-y-6">
          {/* Day 1 */}
          <div className="p-5 rounded-2xl border border-border/80 bg-gradient-to-b from-accent/10 to-transparent">
            <p className="text-xs text-accent font-medium tracking-wider uppercase mb-3">
              Day 1 — {day1.theme}
            </p>
            <p className="text-xs text-text-muted mb-2">What you wrote</p>
            {day1Entry ? (
              <p className="text-sm text-text-secondary leading-relaxed">
                "{day1Entry.response}"
              </p>
            ) : (
              <p className="text-xs text-text-muted italic">No journal entry saved</p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
              <span className="text-text-muted text-xs">→</span>
            </div>
          </div>

          {/* Day 7 */}
          <div className="p-5 rounded-2xl border border-border/80 bg-gradient-to-b from-accent/10 to-transparent">
            <p className="text-xs text-accent font-medium tracking-wider uppercase mb-3">
              Day 7 — {day7.theme}
            </p>
            <p className="text-xs text-text-muted mb-2">What you wrote</p>
            {day7Entry ? (
              <p className="text-sm text-text-secondary leading-relaxed">
                "{day7Entry.response}"
              </p>
            ) : (
              <p className="text-xs text-text-muted italic">No journal entry saved yet</p>
            )}
          </div>

          {/* Reflection prompt */}
          <div className="p-5 rounded-2xl border border-border/80 bg-surface/50">
            <p className="text-xs text-text-muted mb-2">The gap between them is the work you just did.</p>
            <p className="text-xs text-accent italic">
              What's the one word that describes the difference?
            </p>
          </div>

          {/* Stats */}
          <div className="p-5 rounded-2xl border border-border/80 bg-surface/30">
            <p className="text-xs text-text-muted mb-3">Your reset snapshot</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-light text-text-primary">{progress.completedDays.length}</p>
                <p className="text-xs text-text-muted">of 7 days complete</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-light text-text-primary">{progress.journalEntries.length}</p>
                <p className="text-xs text-text-muted">journal entries</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
