# Transactions Dashboard

A **Transactions Management** UI for reviewing payment history, downloading invoices (mock), and retrying failed payments—individually or in bulk. Built with [Next.js](https://nextjs.org) (App Router), [React](https://react.dev) 19, [Tailwind CSS](https://tailwindcss.com) v4, and [shadcn/ui](https://ui.shadcn.com) components.

## Features

- **Payment history** table: transaction ID, amount, date/time (stable `en-US` formatting for SSR), and status badges (Paid, Failed, Retrying, Success after retry).
- **Download invoice** (mock): ~2s “generating PDF” state, then a small dummy file download and a **Sonner** toast when complete.
- **Bulk retry**: checkboxes only on **Failed** rows, header checkbox to select all failed, **Retry selected** runs concurrent mock retries (1–4s per row, ~20% stay failed).
- **Initial load**: skeleton layout while data is “fetched” (simulated delay).

## Tech stack

- Next.js 16, TypeScript, ESLint (`eslint-config-next`)
- Tailwind CSS v4, `tw-animate-css`, theme tokens from shadcn
- UI: shadcn-style primitives (`@base-ui/react` where applicable), **Sonner** toasts

## Getting started

Install dependencies and run the dev server (this repo uses **pnpm**):

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build    # production build
pnpm start    # run production server
pnpm lint     # eslint
```

If `pnpm install` or `pnpm run build` exits with **ignored build scripts** (`ERR_PNPM_IGNORED_BUILDS`), follow pnpm’s hint (for example `pnpm approve-builds` or `CI=true pnpm install`) for your environment.

## Project layout

| Path | Role |
|------|------|
| `app/page.tsx` | Home route; renders the dashboard |
| `app/layout.tsx` | Root layout, fonts, global styles, toasts |
| `app/globals.css` | Tailwind + shadcn theme variables |
| `components/transactions-dashboard.tsx` | Main dashboard: table, skeleton, invoices, bulk retry |
| `components/ui/` | shadcn UI primitives (table, badge, button, checkbox, skeleton, sonner) |
| `lib/mock-transactions.ts` | Mock transaction list |
| `lib/transaction-types.ts` | Shared types |

## Deploy

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying). [Vercel](https://vercel.com) is the usual host for Next.js apps.
