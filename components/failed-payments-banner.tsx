"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type FailedPaymentsBannerProps = {
  failedCount: number;
  selectedCount: number;
  onSelectAllFailed: () => void;
  onRetrySelected: () => void;
  retryDisabled: boolean;
};

export function FailedPaymentsBanner({
  failedCount,
  selectedCount,
  onSelectAllFailed,
  onRetrySelected,
  retryDisabled,
}: FailedPaymentsBannerProps) {
  const heading =
    failedCount === 1 ? "1 failed payment" : `${failedCount} failed payments`;

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-red-200/90 bg-red-50/80 px-5 py-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:border-red-900/55 dark:bg-[oklch(0.17_0.04_22)] dark:backdrop-blur-none"
      role="region"
      aria-label="Failed payments"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <AlertCircle className="size-5" />
        <div className="min-w-0 space-y-1">
          <p className="font-serif text-md font-medium leading-snug tracking-normal text-red-950 dark:text-zinc-50">
            {heading}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-red-300/80 bg-red-100/50 font-serif font-medium text-red-950 shadow-none hover:bg-red-100 dark:border-red-800/60 dark:bg-red-950/30 dark:text-zinc-50 dark:hover:bg-red-950/45"
          onClick={onSelectAllFailed}
        >
          Select All Failed
        </Button>
        <Button
          type="button"
          size="sm"
          className="gap-2 bg-zinc-900 font-serif font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 disabled:opacity-45 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          disabled={retryDisabled}
          onClick={onRetrySelected}
        >
          <RefreshCw className="size-3.5 shrink-0" aria-hidden />
          Retry Selected ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
