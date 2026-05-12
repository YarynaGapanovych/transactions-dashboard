# Transactions Dashboard

A **Transactions Management** UI for reviewing payment history, downloading invoices, and retrying failed payments in bulk. The app uses mock data and client-side delays to simulate API behavior—there is no backend.

## Installation

Use [pnpm](https://pnpm.io) from the project root:

```bash
pnpm install
```

If install or build reports **ignored build scripts** (`ERR_PNPM_IGNORED_BUILDS`), follow pnpm’s prompt (for example `pnpm approve-builds`) or run `CI=true pnpm install` in CI-like environments.

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

## Architecture

The app is a small Next.js front end with a thin server shell and one interactive client surface.

- **`app/`** — `layout.tsx` (fonts, global styles, toaster), `page.tsx` (home route).
- **`components/`** — `transactions-dashboard.tsx` owns table state and mock flows; smaller pieces handle the failed-payments banner, loading skeleton, and status badges.
- **`components/ui/`** — shadcn-style primitives (table, button, checkbox, badge, skeleton, sonner).
- **`lib/`** — mock transaction list, formatting helpers, and status helpers.
- **`types/`** — shared `Transaction` model and `TransactionStatus` enum.

`app/page.tsx` stays a server component and renders the client dashboard. Selection, invoice download, retries, and toasts run in the browser.

## Mock API simulation

There is no REST or GraphQL API. Behavior is simulated in the client:

- **Initial load** — `MOCK_TRANSACTIONS` in `lib/mock-transactions.ts` seeds the table; a short timeout shows a skeleton before data appears.
- **Download invoice** — ~2s loading per row, then a dummy text file download and a Sonner success toast.
- **Bulk retry** — selected failed rows move to `retrying`, then each row resolves on its own timer (about 1–4s) with a ~20% chance of staying `failed`; otherwise `success`.

Formatting uses fixed locale, currency, and timezone settings in `lib/format-config.ts` so server and client output stay aligned.
