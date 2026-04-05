# Investment UI

This project is a Next.js 16 App Router frontend for a NEAR-oriented investment experience.

## Local development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment

The wallet connection layer currently reads these public environment variables:

```bash
NEXT_PUBLIC_NEAR_NETWORK_ID=testnet
NEXT_PUBLIC_NEAR_CONTRACT_ID=
```

- `NEXT_PUBLIC_NEAR_NETWORK_ID`: `testnet` by default, or `mainnet`
- `NEXT_PUBLIC_NEAR_CONTRACT_ID`: optional for the current connect-only flow, useful once contract-scoped wallet permissions are needed

You can copy the values from `.env.example`.

## Current structure

- `app/`: App Router entry points plus all application TypeScript source
- `app/components/`: shared presentation components grouped by responsibility
- `app/features/wallet/`: NEAR wallet-specific provider, UI, and selector setup
- `app/lib/near/`: environment-driven NEAR configuration

Framework-required top-level TypeScript files such as `next.config.ts` remain at the project root because Next.js expects them there.

## Current scope

The first pass includes:

- a professional landing page with an orange-led visual system
- a NEAR wallet connect button backed by Wallet Selector
- a scalable file layout for future authenticated product surfaces
