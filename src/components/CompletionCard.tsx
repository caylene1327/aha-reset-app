import type { UserProgress } from '../types';
import { trackEvent, Events } from '../utils/analytics';

interface CompletionCardProps {
  progress: UserProgress;
  onBack: () => void;
  onStartAgain: () => void;
}

export function CompletionCard({
  progress,
  onBack,
  onStartAgain,
}: CompletionCardProps) {
  const handleShare = async () => {
    trackEvent(Events.COMPLETION_SHARE, {
      daysCompleted: progress.completedDays.length,
      journalEntries: progress.journalEntries.length,
    });

    const text =
      `I completed AHA Reset™\n\n` +
      `7 days of catching patterns I'd been running my whole life.\n\n` +
      `${progress.completedDays.length} days · ${progress.journalEntries.length} journal entries\n\n` +
      `Reset doesn't mean restart. It means you see clearly enough to choose differently.`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'AHA Reset™', text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col">
      <header className="px-6 pt-8 pb-2">
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 flex items-center justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="rounded-3xl border border-accent/20 bg-gradient-to-b from-surface to-[#0f0f0f] p-8 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-accent text-2xl font-light">◈</span>
            </div>

            <h2 className="text-2xl font-light text-text-primary mb-1">You did it.</h2>
            <p className="text-xs text-accent mb-6 font-medium tracking-wider uppercase">
              AHA Reset &trade;
            </p>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              7 days. 7 layers. You showed up for every single one.
            </p>

            <div className="flex justify-center gap-8 mb-6">
              <div>
                <p className="text-3xl font-light text-text-primary">{progress.completedDays.length}</p>
                <p className="text-xs text-text-muted mt-1">Days</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-light text-text-primary">{progress.journalEntries.length}</p>
                <p className="text-xs text-text-muted mt-1">Entries</p>
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div
                  key={d}
                  className={`w-2 h-2 rounded-full ${
                    progress.completedDays.includes(d as never) ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-text-muted leading-relaxed italic mb-8 max-w-xs mx-auto">
              "Reset doesn't mean restart. It means you see clearly enough to choose differently."
            </p>

            <button
              onClick={handleShare}
              className="w-full py-3 px-4 bg-accent/10 border border-accent/20 text-accent text-sm font-medium rounded-xl
                hover:bg-accent/15 transition-all duration-300"
            >
              Share your reset
            </button>

            <button
              onClick={() => {
                trackEvent(Events.RESET_RESTART);
                onStartAgain();
              }}
              className="w-full py-3 mt-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Start a new reset
            </button>
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center">
        <p className="text-xs text-text-muted">AHA Reset &trade;</p>
      </footer>
    </div>
  );
}
