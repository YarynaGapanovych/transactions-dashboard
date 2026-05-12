# Transactions Dashboard

A **Transactions Management** UI for reviewing payment history, downloading invoices, and retrying failed payments in bulk. The app uses mock data and client-side delays to simulate API behavior—there is no backend.

## Installation

Use [pnpm](https://pnpm.io) from the project root:

```bash
pnpm install
```

## Running

Development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run production server
pnpm lint    # ESLint
```

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com) components, [Sonner](https://sonner.emilkowal.ski) toasts
- [Lucide](https://lucide.dev) icons; [Base UI](https://base-ui.com) primitives under some shadcn controls
- ESLint with `eslint-config-next`

## Layout and mocks

`app/page.tsx` renders the client dashboard in `components/transactions-dashboard.tsx`. Mock data lives in `lib/mock-transactions.ts` and is loaded through `lib/transactions-api.ts`.

There is no backend. The UI simulates:

- **Initial load** — short delay, then the transaction table appears.
- **Download invoice** — per-row loading, then a dummy file download and toast.
- **Bulk retry** — selected failed rows retry in parallel with per-row loading and random outcomes.

Date and currency formatting use fixed settings in `lib/format-config.ts`.
