import { useState, useEffect } from 'react';
import type { OnboardingStep } from '../types';
import { trackEvent, Events } from '../utils/analytics';

interface OnboardingProps {
  onComplete: () => void;
}

const SCREENS: OnboardingStep[] = [
  {
    icon: '◈',
    title: 'Who you are right now',
    body: 'Before we start — a single question.\n\nThe version of yourself you\'ve been operating from lately — what would you call it?\n\n(Not the label, the feeling.)',
  },
  {
    icon: '◇',
    title: 'Who you want to become',
    body: 'And the version you want to reconnect with — who is that?\n\nWrite one or two words. The version waiting for you.',
  },
  {
    icon: '○',
    title: 'The gap is the path',
    body: 'You just named the gap. That\'s not a problem to fix — it\'s the starting point.\n\nOver the next 7 days, you\'ll move through the layers between who you\'ve been and who you\'re becoming.\n\nIt starts with simply noticing.',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      trackEvent(Events.ONBOARDING_START);
      setHasStarted(true);
    }
  }, [hasStarted]);

  const handleNext = () => {
    trackEvent(Events.ONBOARDING_STEP, { step: step + 1, total: SCREENS.length });
    if (step < SCREENS.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setVisible(true);
      }, 300);
    } else {
      trackEvent(Events.ONBOARDING_COMPLETE);
      onComplete();
    }
  };

  const handleSkip = () => {
    trackEvent(Events.ONBOARDING_SKIP, { atStep: step + 1 });
    onComplete();
  };

  const screen = SCREENS[step];
  const lines = screen.body.split('\n');

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col px-6">
      {/* Progress */}
      <div className="pt-8 flex justify-center gap-2">
        {SCREENS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === step
                ? 'w-8 bg-accent'
                : i < step
                  ? 'w-2 bg-accent/30'
                  : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <div
          className={`transition-all duration-300 text-center space-y-8 w-full ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-5xl text-accent/60 font-light">{screen.icon}</div>

          <h2 className="text-2xl font-light text-text-primary leading-snug">
            {screen.title}
          </h2>

          <div className="text-sm text-text-secondary leading-relaxed space-y-3">
            {lines.map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>

          {/* Free-text input for steps 1 and 2 */}
          {step < 2 && (
            <div className="pt-2">
              <input
                type="text"
                value={responses[step]}
                onChange={(e) => {
                  const next = [...responses];
                  next[step] = e.target.value;
                  setResponses(next);
                }}
                placeholder={step === 0 ? 'One or two words...' : 'The version waiting for you...'}
                className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl
                  text-sm text-text-primary placeholder:text-text-muted text-center
                  focus:outline-none focus:border-accent/40 focus:bg-surface-lighter
                  transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom action */}
      <div className="pb-12 max-w-sm mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 bg-text-primary text-[#121214] text-sm font-medium rounded-xl
            hover:bg-text-primary/90 transition-all duration-300"
        >
          {step < SCREENS.length - 1
            ? 'Continue →'
            : 'Enter Day 1'}
        </button>
        {step > 0 && (
          <button
            onClick={handleSkip}
            className="w-full py-3 mt-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip — I'm ready
          </button>
        )}
      </div>
    </div>
  );
}
