import { useState, useEffect } from 'react';
import { CheckoutPlaceholder } from './CheckoutPlaceholder';
import { trackEvent, Events, getUTM } from '../utils/analytics';
import { supabase, supabaseConfigured } from '../lib/supabase';

interface LandingProps {
  onStart: () => void;
}

const DAY_OVERVIEW = [
  { day: 1, theme: 'Awareness', desc: 'Notice what\'s actually happening — not the story you tell about it.' },
  { day: 2, theme: 'Patterns', desc: 'See the loop you keep running. Name it. Watch it lose its grip.' },
  { day: 3, theme: 'Triggers', desc: 'Find the moment before the reaction. What\'s really getting activated?' },
  { day: 4, theme: 'Identity', desc: 'Meet the version of yourself that\'s been running things. Decide who\'s next.' },
  { day: 5, theme: 'Boundaries', desc: 'Locate where you end and others begin. Draw a clean line.' },
  { day: 6, theme: 'Self-Trust', desc: 'Start treating yourself like someone you can count on.' },
  { day: 7, theme: 'Integration', desc: 'Hold all of it. Not as a fix — as a new starting point.' },
];

export function Landing({ onStart }: LandingProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent(Events.LANDING_VIEW);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Guard: env vars not configured — fail fast with a clear message
    if (!supabaseConfigured) {
      setError('Email capture is not configured. Check environment variables.');
      console.error('[AHA] handleSubmit aborted — Supabase env vars missing.');
      return;
    }

    setLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const utm = getUTM();

    console.log('[AHA] Attempting Supabase insert for:', normalizedEmail);

    try {
      const { data, error: dbError } = await supabase
        .from('email_signups')
        .insert({
          email: normalizedEmail,
          source: 'landing',
          utm_source:   utm?.utm_source   ?? null,
          utm_medium:   utm?.utm_medium   ?? null,
          utm_campaign: utm?.utm_campaign ?? null,
        })
        .select('id');

      console.log('[AHA] Supabase response → data:', data, '| error:', dbError);

      if (dbError) {
        // 23505 = unique_violation: email already exists — still show success
        if (dbError.code === '23505') {
          console.log('[AHA] Duplicate email — treating as success.');
        } else {
          console.error('[AHA] Insert failed:', {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint,
          });
          setError('Something went wrong. Please try again.');
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('[AHA] Unexpected error during insert:', err);
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    trackEvent(Events.EMAIL_SUBMIT);
    setSubmitted(true);
  };

  const handleStart = () => {
    trackEvent(Events.LANDING_CTA_CLICK);
    onStart();
  };

  return (
    <div className="min-h-svh bg-[#121214] flex flex-col">
      {/* Hero */}
      <section className="min-h-svh flex flex-col items-center justify-center px-6 py-20 max-w-lg mx-auto w-full" id="hero_cta">
        <div className="mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
            <span className="text-accent text-xl font-light">◈</span>
          </div>
        </div>

        <div className="text-center space-y-6 mb-10 animate-slide-up animate-stagger-1">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-text-primary leading-[1.2]">
            You've been running the same pattern
            <span className="block mt-1">long enough.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-sm mx-auto">
            AHA Reset is a 7-day experience that helps you see the version of yourself
            you're ready to leave behind — and reconnect with the one that's been waiting.
          </p>
        </div>

        {/* Email capture */}
        <div className="w-full max-w-sm animate-slide-up animate-stagger-2" id="email_capture">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3.5 bg-surface border border-border rounded-xl
                    text-sm text-text-primary placeholder:text-text-muted
                    focus:outline-none focus:border-accent/40 focus:bg-surface-lighter
                    transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-accent/10 border border-accent/20
                  text-accent text-sm font-medium rounded-xl
                  hover:bg-accent/15 hover:border-accent/30
                  transition-all duration-300 animate-glow
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send me the first prompt'}
              </button>
              {error && (
                <p className="text-xs text-center text-red-400 mt-1 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div className="text-center space-y-4 animate-scale-in">
              <div className="py-3.5 px-4 bg-accent/8 border border-accent/15 rounded-xl">
                <p className="text-sm text-accent">Check your inbox.</p>
                <p className="text-xs text-text-muted mt-1">Your first shift is waiting.</p>
              </div>
              <button
                onClick={handleStart}
                className="w-full py-3.5 px-4 bg-text-primary text-[#121214] text-sm font-medium rounded-xl
                  hover:bg-text-primary/90 transition-all duration-300"
              >
                Enter the Experience →
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center gap-6 text-xs text-text-muted animate-fade-in animate-stagger-4">
          <span>7 days</span>
          <span className="w-px h-3 bg-border" />
          <span>~5 min/day</span>
          <span className="w-px h-3 bg-border" />
          <span>one prompt</span>
        </div>
      </section>

      {/* What This Is */}
      <section className="px-6 py-20 border-t border-border" id="what_this_is">
        <div className="max-w-lg mx-auto w-full text-center space-y-6">
          <h2 className="text-xl font-light text-text-primary">
            This is not a course. This is not therapy.<br />
            <span className="text-accent">This is a reset.</span>
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Seven days. One daily practice. No information dump, no workbook, no homework.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Each day walks you through a single emotional layer — from noticing what's
            really there, to choosing what comes next.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            By the end of the week, you'll have seen your patterns clearly enough
            that you can unhook from them. And you'll know who you are when you do.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 border-t border-border" id="how_it_works">
        <div className="max-w-lg mx-auto w-full">
          <h2 className="text-xl font-light text-text-primary text-center mb-10">
            One layer at a time.
          </h2>
          <div className="space-y-3">
            {DAY_OVERVIEW.map((d) => (
              <div
                key={d.day}
                className="flex items-start gap-4 px-4 py-3 rounded-xl bg-surface/50 border border-border/50"
              >
                <span className="text-xs text-accent font-medium w-8 flex-shrink-0 pt-0.5">
                  Day {d.day}
                </span>
                <div>
                  <p className="text-sm text-text-primary font-medium">{d.theme}</p>
                  <p className="text-xs text-text-muted mt-0.5">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="px-6 py-20 border-t border-border" id="who_this_is_for">
        <div className="max-w-lg mx-auto w-full text-center space-y-6">
          <h2 className="text-xl font-light text-text-primary">
            You know the feeling.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            You keep arriving at the same frustration. The same conversation.
            The same disappointment in yourself — or from someone else.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            You've read the books. You've done the reflecting. But something between
            knowing and doing keeps slipping.
          </p>
          <p className="text-sm text-accent italic">
            This is for people who are done understanding their patterns —
            and ready to let them go.
          </p>
        </div>
      </section>

      {/* What You'll Walk Away With */}
      <section className="px-6 py-20 border-t border-border" id="what_you_leave_with">
        <div className="max-w-lg mx-auto w-full text-center space-y-6">
          <h2 className="text-xl font-light text-text-primary">
            Clarity. Not a to-do list.
          </h2>
          <ul className="space-y-3 text-left">
            {[
              'Emotional clarity about what\'s actually yours to carry',
              'A practical framework for catching patterns before they run you',
              'Renewed self-trust — the kind that comes from showing up for yourself',
              'A shareable moment that marks where you stopped repeating and started choosing',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-accent mt-0.5">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing/Checkout Section */}
      <section className="px-6 py-20 border-t border-border" id="checkout">
        <div className="max-w-lg mx-auto w-full text-center space-y-6">
          <h2 className="text-xl font-light text-text-primary">
            Start your reset.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            One payment. Seven days. A lifetime of catching yourself before the loop closes.
          </p>
          <CheckoutPlaceholder />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-border">
        <p className="text-xs text-text-muted">
          AHA Reset &trade; — 7-day emotional reset
        </p>
      </footer>
    </div>
  );
}
