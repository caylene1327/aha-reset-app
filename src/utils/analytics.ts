/**
 * AHA Reset™ — Lightweight Analytics Instrumentation
 *
 * Captures UTM parameters, tracks funnel events, and stores them in localStorage
 * for later export/transmission to an analytics endpoint.
 *
 * KPI Funnel:
 *   Landing View → Email Submit → Checkout Click → Onboarding Complete
 *   → Day 1..7 Complete → Day 7 Share
 *
 * UTM parameters are captured once on first page load and persisted.
 * All events are timestamped and stored in a rolling log.
 */

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  meta?: Record<string, string | number | boolean>;
}

export interface UTMCapture {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY_EVENTS = 'aha-analytics-events';
const STORAGE_KEY_UTM = 'aha-analytics-utm';

// ─── UTM Capture ───────────────────────────────────────────────

export function captureUTM(): UTMCapture {
  const stored = localStorage.getItem(STORAGE_KEY_UTM);
  if (stored) {
    return JSON.parse(stored) as UTMCapture;
  }

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const utm: UTMCapture = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };

  // Only persist if at least one UTM param is present
  if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
    localStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(utm));
  }

  return utm;
}

// ─── Event Tracking ─────────────────────────────────────────────

export function trackEvent(
  event: string,
  meta?: Record<string, string | number | boolean>,
): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

    events.push({
      event,
      timestamp: Date.now(),
      meta: {
        ...meta,
        // Attach UTM to every event for attribution
        ...captureUTM(),
      },
    });

    // Keep last 200 events to avoid storage bloat
    if (events.length > 200) {
      events.splice(0, events.length - 200);
    }

    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));

    // Also log to console in development for debugging
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, meta || '');
    }
  } catch {
    // Silently fail — analytics should never break the app
  }
}

// ─── Event Constants ────────────────────────────────────────────

export const Events = {
  // Landing funnel
  LANDING_VIEW: 'landing_view',
  LANDING_CTA_CLICK: 'landing_cta_click',
  EMAIL_SUBMIT: 'email_submit',
  CHECKOUT_CLICK: 'checkout_click',

  // Onboarding funnel
  ONBOARDING_START: 'onboarding_start',
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  ONBOARDING_SKIP: 'onboarding_skip',

  // Daily engagement funnel
  DAY_VIEW: (day: number) => `day_${day}_view`,
  DAY_COMPLETE: (day: number) => `day_${day}_complete`,
  JOURNAL_SAVE: (day: number) => `day_${day}_journal_save`,

  // Comparison & completion
  COMPARISON_VIEW: 'comparison_view',
  COMPLETION_VIEW: 'completion_view',
  COMPLETION_SHARE: 'completion_share',
  RESET_RESTART: 'reset_restart',
} as const;

// ─── Export / Clear ─────────────────────────────────────────────

export function getEvents(): AnalyticsEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getUTM(): UTMCapture | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_UTM);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearEvents(): void {
  localStorage.removeItem(STORAGE_KEY_EVENTS);
}

export function exportEvents(): string {
  const events = getEvents();
  const utm = getUTM();
  return JSON.stringify({ utm, events, exportedAt: Date.now() }, null, 2);
}