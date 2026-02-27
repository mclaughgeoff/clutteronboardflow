# Clutter Concierge Storage — Sign-Up Flow

## Overview
A fully interactive, production-ready sign-up flow for Clutter — a premium concierge storage company. Built as a mobile-first prototype in a phone frame with Framer Motion animations throughout.

## Architecture
- **Frontend-only flow** — all state managed via React Context (`FlowContext`)
- No backend API endpoints used — the Express server just serves the Vite frontend
- Phone frame UI centered on a warm background

## Tech Stack
- React 18 with hooks (useState, useContext, useEffect, useMemo, useCallback)
- Tailwind CSS for all styling
- Framer Motion for animations and transitions
- date-fns for date formatting/manipulation
- Lucide React for icons
- Outfit (headlines) + Plus Jakarta Sans (body) fonts (Google Fonts)

## Project Structure
```
client/src/
├── App.tsx              — Renders FlowController
├── index.css            — Tailwind base + design tokens
├── lib/
│   ├── state.ts         — FlowState type, context, provider
│   ├── pricing.ts       — Pricing table, labor fees, progressive discounts, plan breakdowns
│   ├── items.ts         — Item library (31 items), cuft thresholds, size calculator
│   ├── availability.ts  — Date availability simulation
│   └── recommendations.ts — Situation defaults (legacy, used by old screens)
├── components/
│   ├── flow/
│   │   ├── FlowController.tsx — Screen routing, state, history stack
│   │   ├── ProgressBar.tsx
│   │   └── TopNav.tsx
│   └── screens/
│       ├── Screen1Intent.tsx       — Zip code only entry
│       ├── Screen2Intent.tsx       — Service intent (Storage / Storage+Moving / Move Only)
│       ├── Screen3Education.tsx    — Auto-advance education interstitial (storage)
│       ├── Screen4Size.tsx         — Advisor card + quick select (storage)
│       ├── ScreenAdvisor.tsx       — Dedicated item advisor (search, chips, cuft calc, fullness bar)
│       ├── Screen5Pricing.tsx      — Size confirmation/adjustment cards
│       ├── Screen5BTimeline.tsx    — Storage timeline (3 options, routes to 5C or 6)
│       ├── Screen5CSubjobs.tsx    — Sub-job frequency (skip for flexible, adjusts pricing)
│       ├── Screen6Tier.tsx         — Service tier selection (labor context banner)
│       ├── Screen7Tier.tsx         — Pricing reveal (subjob adjustments, comparison table)
│       ├── Screen7Date.tsx         — Calendar + availability
│       ├── Screen8Lead.tsx         — Contact info capture (storage flow)
│       ├── Screen9Addons.tsx       — Optional add-ons with toggles
│       ├── Screen10Review.tsx      — Full booking review
│       ├── ScreenSuccess.tsx       — Animated success screen (storage)
│       ├── MovingScreen1Dates.tsx  — Pickup + delivery date selection (collapsible calendars)
│       ├── MovingScreen2Stuff.tsx  — Room/volume selection for moving (no dimensions)
│       ├── MovingScreen3Tier.tsx   — Service tier (moving-specific copy)
│       ├── MovingScreen4Education.tsx — Auto-advance interstitial (moving)
│       ├── MovingScreen5Outcome.tsx — Personalized quote card (Clutter/Flex)
│       ├── MovingLeadCapture.tsx   — Lead capture (moving flow, both addresses)
│       └── MovingSuccess.tsx       — Success screen (Clutter teal / Flex yellow)
│       (Legacy/unused: Screen2Situation.tsx, Screen2BConfirmation.tsx, ScreenFlexHandoff.tsx)
```

## Flow Branches
- **Branch A (Storage)**: Zip → Intent → Education → Size → Advisor (optional) → Confirmation → Timeline → Subjobs (skip if flexible) → Tier → Pricing → Date → Lead → Add-ons → Review → Success
- **Branch B1 (Storage + Moving)**: Zip → Intent → Moving Dates → Stuff → Tier → Education → Outcome → Lead → Success
- **Branch B2 (Move Only)**: Zip → Intent → Moving Dates → Stuff → Tier → Education → Outcome → Lead → Success

## Screen IDs
- Storage: screen-1, screen-2, screen-3, screen-4, screen-advisor, screen-5, screen-5b, screen-5c, screen-6, screen-7, screen-date, screen-lead, screen-addons, screen-review, screen-success
- Moving: screen-1, screen-2, moving-dates, moving-stuff, moving-tier, moving-education, moving-outcome, moving-lead, moving-success

## Pricing Model
- **Monthly storage**: Separate rates for M2M, 4-month (committed), 8-month (longhaul)
- **Labor fees**: One-time, separated from monthly — included free on committed/longhaul, charged on flexible
- **Progressive discounts**: Committed gets 10% off at month 5, 19% off at month 9; Longhaul gets 10% off at month 9
- **Sub-job multipliers**: never=−15%, onceTwice=0, fewTimes=+10% committed/0 longhaul, frequently=+15% committed/+5% longhaul; flexible has no subjob adjustment
- **Tier savings**: White Glove (baseline), Pre-Packed (~10% savings), You Load (~20% savings via Flex)
- **Moving (Clutter)**: monthly rate based on auto-determined plan + pickup/delivery costs
- **Moving (Flex)**: flat quote based on volume + tier adjustment

## Moving Flow Routing
- Duration < 30 days → Flex route (flat move quote)
- Duration >= 30 days or unknown → Clutter route (monthly storage + services)
- Route determined silently by date selection, shown on outcome screen

## Design System
- **Colors**: Teal (#1B7A6E), Charcoal (#1C1C1E), Mist (#F8F7F4), Warm (#EDECEA), Flex (#F5A623)
- **Typography**: Outfit for headlines (font-serif), Plus Jakarta Sans for body (font-sans)
- **Cards**: White bg, border, rounded-2xl, teal highlight when selected
- **Buttons**: Teal primary, disabled grey, rounded-2xl
- **Education screens**: Auto-advance at 2200ms with bottom progress bar, tap-to-skip (whole screen tappable)
- **No italic text** — use `<span className="text-teal font-semibold">` for accent words

## Running
`npm run dev` starts Express + Vite dev server
