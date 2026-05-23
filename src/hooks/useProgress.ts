import { useState, useCallback, useEffect } from 'react';
import type { UserProgress, DayId, JournalEntry } from '../types';

const STORAGE_KEY = 'aha-reset-progress';

function loadProgress(): UserProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function createFreshProgress(): UserProgress {
  return {
    completedDays: [],
    currentDay: 1 as DayId,
    startedAt: Date.now(),
    streakActive: false,
    journalEntries: [],
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    return loadProgress() || createFreshProgress();
  });

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeDay = useCallback((dayId: DayId) => {
    setProgress((prev) => {
      if (prev.completedDays.includes(dayId)) return prev;
      const next = dayId + 1;
      return {
        ...prev,
        completedDays: [...prev.completedDays, dayId],
        currentDay: (next <= 7 ? next : 7) as DayId,
        streakActive: true,
      };
    });
  }, []);

  const saveJournalEntry = useCallback((entry: JournalEntry) => {
    setProgress((prev) => {
      const existing = prev.journalEntries.filter((e) => e.dayId !== entry.dayId);
      return {
        ...prev,
        journalEntries: [...existing, entry],
      };
    });
  }, []);

  const getJournalEntry = useCallback(
    (dayId: DayId): JournalEntry | undefined => {
      return progress.journalEntries.find((e) => e.dayId === dayId);
    },
    [progress.journalEntries]
  );

  const startReset = useCallback(() => {
    const fresh = createFreshProgress();
    setProgress(fresh);
    saveProgress(fresh);
  }, []);

  return {
    progress,
    completeDay,
    saveJournalEntry,
    getJournalEntry,
    startReset,
  };
}