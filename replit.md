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
│   ├── pricing.ts       — Pricing table, tier multipliers, getMovingQuote
│   ├── availability.ts  — Date availability simulation
│   └── recommendations.ts — Situation defaults, size logic
├── components/
│   ├── flow/
│   │   ├── FlowController.tsx — Screen routing, state, history stack
│   │   ├── ProgressBar.tsx
│   │   └── TopNav.tsx
│   └── screens/
│       ├── Screen1Intent.tsx       — Zip code only entry
│       ├── Screen2Intent.tsx       — Service intent (Storage / Storage+Moving / Move Only)
│       ├── Screen2Situation.tsx    — Situation cards (Branch A only)
│       ├── Screen3Education.tsx    — Auto-advance education interstitial (storage)
│       ├── Screen4Size.tsx         — Dual-path size selection
│       ├── Screen5Pricing.tsx      — Size recommendation cards
│       ├── Screen6Tier.tsx         — Plan selection (pricing)
│       ├── Screen7Tier.tsx         — Service tier selection
│       ├── Screen7Date.tsx         — Calendar + availability
│       ├── Screen8Lead.tsx         — Contact info capture (storage flow)
│       ├── Screen9Addons.tsx       — Optional add-ons with toggles
│       ├── Screen10Review.tsx      — Full booking review
│       ├── ScreenSuccess.tsx       — Animated success screen (storage)
│       ├── ScreenFlexHandoff.tsx   — Legacy Flex handoff (unused)
│       ├── Screen2BConfirmation.tsx — Legacy confirmation (unused)
│       ├── MovingScreen1Dates.tsx  — Pickup + delivery date selection
│       ├── MovingScreen2Stuff.tsx  — Room/volume selection for moving
│       ├── MovingScreen3Tier.tsx   — Service tier (moving-specific copy)
│       ├── MovingScreen4Education.tsx — Auto-advance interstitial (moving)
│       ├── MovingScreen5Outcome.tsx — Personalized quote card (Clutter/Flex)
│       ├── MovingLeadCapture.tsx   — Lead capture (moving flow, both addresses)
│       └── MovingSuccess.tsx       — Success screen (Clutter teal / Flex yellow)
```

## Flow Branches
- **Branch A (Storage)**: Zip → Intent → Situation → Education → Size → Pricing → Plan → Tier → Date → Lead → Add-ons → Review → Success
- **Branch B1 (Storage + Moving)**: Zip → Intent → Moving Dates → Stuff → Tier → Education → Outcome → Lead → Success
- **Branch B2 (Move Only)**: Zip → Intent → Moving Dates → Stuff → Tier → Education → Outcome → Lead → Success

## Screen IDs
- Storage: screen-1, screen-2, screen-situation, screen-3, screen-4, screen-5, screen-6, screen-7, screen-date, screen-lead, screen-addons, screen-review, screen-success
- Moving: screen-1, screen-2, moving-dates, moving-stuff, moving-tier, moving-education, moving-outcome, moving-lead, moving-success

## Moving Flow Routing
- Duration < 30 days → Flex route (flat move quote)
- Duration >= 30 days or unknown → Clutter route (monthly storage + services)
- Route determined silently by date selection, shown on outcome screen

## Pricing
- Storage: pricing table by size × plan × tier multiplier
- Moving (Clutter): monthly rate based on auto-determined plan + pickup/delivery costs
- Moving (Flex): flat quote based on volume + tier adjustment

## Design System
- **Colors**: Teal (#1B7A6E), Charcoal (#1C1C1E), Mist (#F8F7F4), Warm (#EDECEA), Flex (#F5A623)
- **Typography**: Outfit for headlines (font-serif), Plus Jakarta Sans for body (font-sans)
- **Cards**: White bg, border, rounded-2xl, teal highlight when selected
- **Buttons**: Teal primary, disabled grey, rounded-2xl
- **Education screens**: Auto-advance at 2200ms with bottom progress bar, tap-to-skip

## Running
`npm run dev` starts Express + Vite dev server
