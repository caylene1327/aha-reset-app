# AHA Reset™ — 7-Day Emotional Reset Experience

A guided **7-day transformation experience** for people stuck in recurring emotional patterns who want to reconnect with themselves. Built with React + TypeScript + Tailwind CSS v4.

**Live demo:** [Deploy on Railway in one click](#deploy-to-railway)

---

## ✦ What This Is

Not a course. Not therapy. A reset.

Seven days. One daily practice. Each day walks through a single emotional layer:

1. **Awareness** — Notice what's really there
2. **Patterns** — See the loop you keep running
3. **Triggers** — Find the moment before the reaction
4. **Identity** — Meet the version of yourself that's been running things
5. **Boundaries** — Locate where you end and others begin
6. **Self-Trust** — Start treating yourself like someone you can count on
7. **Integration** — Hold all of it as a new starting point

## ✦ Tech Stack

- **Vite** (build tool)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **State:** React hooks + localStorage persistence
- **Font:** Inter (via Google Fonts)

## ✦ Project Structure

```
aha-reset-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Landing.tsx              # Landing page (hero, sections, email capture)
│   │   ├── CheckoutPlaceholder.tsx  # Explicit checkout integration point
│   │   ├── Onboarding.tsx           # Cinematic 3-step onboarding flow
│   │   ├── Dashboard.tsx            # Day tiles, progress bar, streak
│   │   ├── DayView.tsx              # Read → Reflect → Close daily session
│   │   ├── Journal.tsx              # Private journal section
│   │   ├── Comparison.tsx           # Day 1 vs Day 7 comparison
│   │   └── CompletionCard.tsx       # Shareable completion screen
│   ├── data/
│   │   ├── days.ts                  # 7-day content (copy-swappable data layer)
│   │   └── daily-flow.json          # Mirror of writer's copy pack (source of truth)
│   ├── hooks/
│   │   └── useProgress.ts           # localStorage-persisted progress state
│   ├── types.ts                     # TypeScript interfaces
│   ├── App.tsx                      # View orchestrator
│   ├── index.css                    # Tailwind imports + custom theme
│   └── main.tsx                     # Entry point
├── index.html
├── vite.config.ts
├── nixpacks.toml                    # Railway deployment config
└── package.json
```

## ✦ Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
cd /home/team/shared/aha-reset-app
npm install          # already installed
npm run dev          # dev server at localhost:5173
```

### Build for Production

```bash
npm run build        # output → dist/
npx serve dist -l 3000 --single
```

## ✦ Deploy to Railway

Pre-configured with `nixpacks.toml`.

1. Push to a GitHub repo
2. On Railway, click **New Project → Deploy from GitHub repo**
3. Select your repo → Railway auto-detects Node.js config
4. Deploy (no env vars required for static frontend)

If integrating email capture, add `VITE_API_URL`.

## ✦ Copy Integration & Data Mapping

All product copy flows from the writer's copy pack at `/home/team/shared/aha-reset-copy/`. A mirror of the structured data lives at `src/data/daily-flow.json`. The app reads from `src/data/days.ts`, which implements the exact same shape.

### daily-flow.json → DayContent interface mapping

| daily-flow.json field | DayContent field | Type | Appears in |
|---|---|---|---|
| `day` | `day` | `DayId` (1-7) | Dashboard, DayView |
| `theme` | `theme` | string | Dashboard tile, DayView header |
| `title` | `title` | string | DayView header |
| `summary` | `summary` | string | DayView "Read" section |
| `prompt` | `prompt` | string | DayView "Reflect" section |
| `exercise` | `exercise` | string | DayView "Try this" section |
| `reflectionCheckpoint` | `reflectionCheckpoint` | string | DayView completion state |
| `milestoneMessage` | `milestoneMessage` | string | DayView footer (post-completion) |

### How to swap copy

**Option A — Replace the data file:**
Replace `src/data/days.ts` while keeping the `DayContent` interface shape. The entire app reads from this single source.

**Option B — Direct JSON import (advanced):**
Replace `src/data/daily-flow.json` with an updated version and update `src/data/days.ts` to import directly:

```ts
import dailyFlow from './daily-flow.json';
export const DAYS: DayContent[] = dailyFlow.map(/* cast to DayContent */);
```

### Copy pack reference files

| File | Content |
|---|---|
| `daily-flow.json` | Structured 7-day content (summary, prompt, exercise, etc.) |
| `landing-copy.md` | Landing page sections, pricing, guarantee copy |
| `onboarding-copy.md` | Onboarding flow copy (3 steps) |
| `social-hooks.md` | Social media hook lines and CTA variants |

## ✦ Design System

Cinematic premium palette: **soft gray/azure** — dim neutrals with an azure accent.

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#121214` | Page background |
| `surface` | `#1c1c20` | Card/container background |
| `surface-lighter` | `#242428` | Elevated surface |
| `surface-light` | `#2c2c32` | Hover/active states |
| `text-primary` | `#e8e8ec` | Primary text |
| `text-secondary` | `#a0a0a8` | Secondary text |
| `text-muted` | `#6b6b74` | Muted/label text |
| `accent` | `#6c9fff` | Azure accent (CTAs, highlights) |
| `accent-light` | `rgba(108, 159, 255, 0.12)` | Subtle accent backgrounds |
| `border` | `#2a2a2e` | Subtle borders |
| `border-light` | `#36363c` | Hover/active borders |

Typography: Inter (200–500 weight). Dark cinematic theme. Mobile-first.

## ✦ Checkout Integration

The checkout flow is marked with an explicit placeholder at `src/components/CheckoutPlaceholder.tsx`. It renders:

- A price card (defaults to "$XX")
- A disabled "Complete your reset" button with a **"Checkout placeholder"** badge
- A hidden HTML comment with integration instructions for developers
- Refund guarantee copy

**To integrate:**
1. Open `src/components/CheckoutPlaceholder.tsx`
2. Replace the `handleClick` function with your payment provider's redirect/call
3. Remove the `disabled` prop from the button
4. Pass the real price via the `price` prop
5. The component is used in `Landing.tsx` — search for `<CheckoutPlaceholder />`

## ✦ Implemented Requirements Checklist

| Requirement | Status |
|---|---|
| Landing page (hero, positioning, how it works, who it's for, benefits) | ✅ |
| Email capture form (inline with success state) | ✅ |
| Checkout/payment flow placeholder (explicit, labelled, documented) | ✅ |
| Cinematic onboarding flow (3-step, animated, identity prompts) | ✅ |
| Daily reset dashboard (7 tiles, lock/unlock/active/completed states) | ✅ |
| Day session view (Read → Reflect → Close) | ✅ |
| Private journal (per-day, save/reset, timestamps) | ✅ |
| Progress tracker + streak psychology (streak bar, milestone messages) | ✅ |
| Day 1 vs Day 7 comparison view | ✅ |
| Shareable completion card (Web Share API + clipboard) | ✅ |
| Mobile-first responsive design | ✅ |
| Railway-ready deployment config (`nixpacks.toml`) | ✅ |
| Copy pack integration (mirrored `daily-flow.json` + documented mapping) | ✅ |
| Clean TypeScript build (`npm run build` passes with 0 errors) | ✅ |

## ✦ Analytics Instrumentation

A lightweight, vendor-neutral analytics layer lives at `src/utils/analytics.ts`. It captures UTM parameters, fires typed events at key funnel touchpoints, and stores them in localStorage for later export.

### Storage Behavior

| Key | Contents | Limit |
|---|---|---|
| `aha-analytics-utm` | Captured UTM params (persisted on first visit) | Single record |
| `aha-analytics-events` | Timestamped event log | 200-event rolling cap (oldest dropped) |

### UTM Capture

On first page visit, `captureUTM()` reads URL search params and persists them to localStorage. All subsequent events automatically include the captured UTM data for attribution.

**Supported params:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

### Event Catalog

All events are defined as constants in `Events` and fired via `trackEvent(eventName, meta?)`.

| Event | Trigger Point | Meta Payload Example |
|---|---|---|
| `landing_view` | Landing page mount | `{}` |
| `landing_cta_click` | "Enter the Experience" / "Begin" button | `{}` |
| `email_submit` | Email capture form submission | `{}` |
| `checkout_click` | Checkout button clicked | `{}` |
| `onboarding_start` | Onboarding flow begins | `{}` |
| `onboarding_step` | Each onboarding step | `{ step: 1, total: 3 }` |
| `onboarding_complete` | Onboarding finishes | `{}` |
| `onboarding_skip` | User skips onboarding | `{ atStep: 2 }` |
| `day_{n}_view` | User opens a day session | `{ day: 3 }` |
| `day_{n}_complete` | User marks a day done | `{ day: 3, theme: "Triggers" }` |
| `day_{n}_journal_save` | Journal entry saved | `{ dayId: 3, charCount: 142 }` |
| `comparison_view` | Day 1 vs Day 7 comparison opened | `{}` |
| `completion_view` | Completion card viewed | `{}` |
| `completion_share` | Share button clicked on completion | `{ daysCompleted: 7, journalEntries: 5 }` |
| `reset_restart` | "Start a new reset" clicked | `{}` |

### Integration with Analytics Platforms

The current implementation is **vendor-neutral** — no external dependencies. To connect a platform:

**Google Analytics 4 (GA4):**
```ts
// In src/utils/analytics.ts, add to trackEvent():
import ReactGA from 'react-ga4';
ReactGA.event(event, meta);
```

**PostHog:**
```ts
// In src/utils/analytics.ts, add to trackEvent():
import posthog from 'posthog-js';
posthog.capture(event, meta);
```

**Segment:**
```ts
// In src/utils/analytics.ts, add to trackEvent():
import analytics from '@segment/analytics-next';
analytics.track(event, meta);
```

**Custom endpoint:**
```ts
// In src/utils/analytics.ts, add to trackEvent():
fetch('https://your-api.com/analytics', {
  method: 'POST',
  body: JSON.stringify({ event, meta, utm: captureUTM() }),
});
```

### Exporting Events

For debugging or manual review:

```ts
import { getEvents, exportEvents } from '../utils/analytics';
console.log(exportEvents()); // Full JSON dump
```

Data can be cleared with `clearEvents()`.

## ✦ License

Proprietary — AHA Reset™
