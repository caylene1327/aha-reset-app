import { useState } from 'react';
import type { DayId, JournalEntry } from '../types';
import { trackEvent, Events } from '../utils/analytics';

interface JournalSectionProps {
  dayId: DayId;
  existingEntry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
}

export function JournalSection({ dayId, existingEntry, onSave }: JournalSectionProps) {
  const [text, setText] = useState(existingEntry?.response || '');
  const [saved, setSaved] = useState(!!existingEntry);

  const handleSave = () => {
    if (!text.trim()) return;
    trackEvent(Events.JOURNAL_SAVE(dayId), { dayId, charCount: text.trim().length });
    onSave({
      dayId,
      response: text.trim(),
      timestamp: Date.now(),
    });
    setSaved(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">Your private notes</p>
        <span className="text-xs text-text-muted">{text.length} chars</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        placeholder="Write freely. This is for you — no rules, no judgment..."
        rows={5}
        className="w-full px-4 py-3 bg-surface border border-border rounded-xl
          text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none focus:border-accent/40 focus:bg-surface-lighter
          transition-all duration-300 resize-none"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!text.trim() || saved}
          className={`px-4 py-2 text-xs rounded-lg transition-all duration-300 ${
            saved
              ? 'bg-accent/8 text-accent/60 border border-accent/15'
              : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15'
          }`}
        >
          {saved ? '✓ Saved' : 'Save entry'}
        </button>
      </div>

      {saved && (
        <p className="text-xs text-text-muted italic">
          Saved · {new Date(existingEntry?.timestamp || Date.now()).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
