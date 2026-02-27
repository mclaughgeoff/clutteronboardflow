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
- date-fns for date formatting
- Lucide React for icons
- DM Serif Display + DM Sans fonts (Google Fonts)

## Project Structure
```
client/src/
├── App.tsx              — Renders FlowController
├── index.css            — Tailwind base + design tokens
├── lib/
│   ├── state.ts         — FlowState type, context, provider
│   ├── pricing.ts       — Pricing table, tier multipliers
│   ├── availability.ts  — Date availability simulation
│   └── recommendations.ts — Situation defaults, size logic
├── components/
│   ├── flow/
│   │   ├── FlowController.tsx — Screen routing, state, history stack
│   │   ├── ProgressBar.tsx
│   │   └── TopNav.tsx
│   └── screens/
│       ├── Screen1Intent.tsx      — Zip + intent selection
│       ├── Screen2Situation.tsx   — Situation cards (Branch A)
│       ├── Screen2BConfirmation.tsx — Journey confirmation (B1/B3)
│       ├── Screen3Education.tsx   — Animated education interstitial
│       ├── Screen4Size.tsx        — Dual-path size selection
│       ├── Screen5Pricing.tsx     — Size recommendation cards
│       ├── Screen6Tier.tsx        — Plan selection (pricing)
│       ├── Screen7Date.tsx        — Calendar + availability
│       ├── Screen8Lead.tsx        — Contact info capture
│       ├── Screen9Addons.tsx      — Optional add-ons with toggles
│       ├── Screen10Review.tsx     — Full booking review
│       ├── ScreenSuccess.tsx      — Animated success screen
│       └── ScreenFlexHandoff.tsx  — Flex partner handoff
```

## Flow Branches
- **Branch A**: Storage (returning to same address) — full 10-screen flow
- **Branch B1**: Moving + needs storage (local) — similar to A with 2B confirmation
- **Branch B2**: Moving, no storage, local — Flex handoff (short flow)
- **Branch B3**: Moving + needs storage (long distance) — like B1 with Flex delivery
- **Branch B4**: Moving, no storage, long distance — Flex handoff (short flow)

## Design System
- **Colors**: Teal (#1B7A6E), Charcoal (#1C1C1E), Mist (#F8F7F4), Warm (#EDECEA)
- **Typography**: DM Serif Display for headlines, DM Sans for body
- **Cards**: White bg, border, rounded-2xl, teal highlight when selected
- **Buttons**: Teal primary, disabled grey, rounded-2xl

## Running
`npm run dev` starts Express + Vite dev server
