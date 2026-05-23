import { useState } from 'react';
import type { DayContent, DayId, JournalEntry } from '../types';
import { JournalSection } from './Journal';
import { trackEvent, Events } from '../utils/analytics';

interface DayViewProps {
  day: DayContent;
  existingEntry?: JournalEntry;
  isCompleted: boolean;
  onComplete: (dayId: DayId) => void;
  onSaveJournal: (entry: JournalEntry) => void;
  onBack: () => void;
}

const DAY_COLORS: Record<number, string> = {
  1: 'from-accent/15 to-accent/5',
  2: 'from-accent/12 to-accent/3',
  3: 'from-accent/10 to-accent/4',
  4: 'from-accent/15 to-accent/5',
  5: 'from-accent/12 to-accent/3',
  6: 'from-accent/10 to-accent/4',
  7: 'from-accent/18 to-accent/6',
};

export function DayView({
  day,
  existingEntry,
  isCompleted,
  onComplete,
  onSaveJournal,
  onBack,
}: DayViewProps) {
  const [showJournal, setShowJournal] = useState(!!existingEntry);
  const [completed, setCompleted] = useState(isCompleted);

  const handleComplete = () => {
    setCompleted(true);
    trackEvent(Events.DAY_COMPLETE(day.day), { day: day.day, theme: day.theme });
    onComplete(day.day);
  };

  const summaryParagraphs = day.summary.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
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

          <div className="space-y-1">
            <p className="text-xs text-accent font-medium tracking-wider uppercase">
              Day {day.day} — {completed ? 'Complete ✓' : 'Ready'}
            </p>
            <h1 className="text-2xl font-light text-text-primary">
              {day.title}
            </h1>
            <p className="text-sm text-text-muted italic">
              {day.themeSub}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-lg mx-auto w-full space-y-6">
          {/* Summary / Read section */}
          <div className={`p-6 rounded-2xl border bg-gradient-to-b ${DAY_COLORS[day.day] || DAY_COLORS[1]} border-border/80 space-y-4`}>
            {summaryParagraphs.map((p, i) => (
              <p key={i} className="text-sm text-text-primary leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Prompt / Reflect section */}
          <div className="p-6 rounded-2xl border border-border/80 bg-surface/30">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3 font-medium">
              Your prompt
            </p>
            <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
              {day.prompt}
            </div>
          </div>

          {/* Exercise */}
          <div className="p-4 rounded-xl border border-dashed border-border/60">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-medium">
              Try this
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {day.exercise}
            </p>
          </div>

          {/* Journal toggle */}
          {!showJournal ? (
            <button
              onClick={() => setShowJournal(true)}
              className="w-full py-3 px-4 border border-dashed border-border rounded-xl
                text-xs text-text-muted hover:text-text-secondary hover:border-border-light
                transition-all duration-300"
            >
              + Open your journal
            </button>
          ) : (
            <JournalSection
              dayId={day.day}
              existingEntry={existingEntry}
              onSave={onSaveJournal}
            />
          )}

          {/* Reflection checkpoint */}
          {completed && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-muted leading-relaxed italic">
                {day.reflectionCheckpoint}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Complete button */}
      <footer className="px-6 pb-8">
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`w-full py-3.5 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${
              completed
                ? 'bg-accent/10 border border-accent/15 text-accent/60'
                : 'bg-text-primary text-[#121214] hover:bg-text-primary/90'
            }`}
          >
            {completed ? '✓ Day complete' : 'Done for today'}
          </button>

          {completed && (
            <p className="text-center text-xs text-text-muted mt-3">
              {day.milestoneMessage}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
