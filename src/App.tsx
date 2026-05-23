import { useState } from 'react';
import type { AppView, DayId } from './types';
import { DAYS } from './data/days';
import { useProgress } from './hooks/useProgress';
import { Landing } from './components/Landing';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { DayView } from './components/DayView';
import { Comparison } from './components/Comparison';
import { CompletionCard } from './components/CompletionCard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [selectedDayId, setSelectedDayId] = useState<DayId | null>(null);
  const { progress, completeDay, saveJournalEntry, getJournalEntry, startReset } =
    useProgress();

  const handleStart = () => setView('onboarding');
  const handleOnboardingComplete = () => {
    startReset();
    setView('dashboard');
  };
  const handleSelectDay = (dayId: DayId) => {
    setSelectedDayId(dayId);
    setView('day');
  };
  const handleBackToDashboard = () => {
    setSelectedDayId(null);
    setView('dashboard');
  };
  const handleComparison = () => setView('comparison');
  const handleCompletion = () => setView('completion');
  const handleStartAgain = () => {
    startReset();
    setView('dashboard');
  };

  switch (view) {
    case 'onboarding':
      return <Onboarding onComplete={handleOnboardingComplete} />;

    case 'dashboard':
      return (
        <Dashboard
          progress={progress}
          onSelectDay={handleSelectDay}
          onComparison={handleComparison}
          onCompletion={handleCompletion}
        />
      );

    case 'day': {
      const day = DAYS.find((d) => d.day === selectedDayId);
      if (!day) {
        setView('dashboard');
        return null;
      }
      return (
        <DayView
          day={day}
          existingEntry={getJournalEntry(day.day)}
          isCompleted={progress.completedDays.includes(day.day)}
          onComplete={completeDay}
          onSaveJournal={saveJournalEntry}
          onBack={handleBackToDashboard}
        />
      );
    }

    case 'comparison':
      return <Comparison progress={progress} onBack={handleBackToDashboard} />;

    case 'completion':
      return (
        <CompletionCard
          progress={progress}
          onBack={handleBackToDashboard}
          onStartAgain={handleStartAgain}
        />
      );

    default:
      return <Landing onStart={handleStart} />;
  }
}