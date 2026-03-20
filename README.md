# Ari Portfolio Scaffold

This repository contains a scaffold-only pass for a modular Next.js portfolio foundation.

## Stack
- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion

## Key Foundations Included
- Tokenized light/dark theme variables in `src/app/globals.css`
- Font system:
  - Local: Neue Regrade (`src/app/fonts/neue-regrade`)
  - Local: Epoch (`src/app/fonts/epoch`)
  - Google: Instrument Serif (`next/font/google`)
- Reusable component layers:
  - `src/components/layout`
  - `src/components/typography`
  - `src/components/ui`
  - `src/components/home`
- Motion presets in `src/lib/motion.ts`
- Data placeholders in `src/data`
- Route placeholders for:
  - `/`
  - `/work`
  - `/experiments`
  - `/about`
  - `/contact`
  - `/cv`

## Development
```bash
npm install
npm run dev
```

## Troubleshooting
- If you see a hydration warning mentioning unexpected attributes like `bis_skin_checked`, it is usually caused by a browser extension injecting DOM attributes.
- Validate in an Incognito/Private window or disable the extension, then hard refresh (`Ctrl+Shift+R`).
- This warning is external to the app when those injected attributes appear.
P2
