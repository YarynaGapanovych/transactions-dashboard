"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type FailedPaymentsBannerProps = {
  failedCount: number;
  selectedCount: number;
  onSelectAllFailed: () => void;
  onRetrySelected: () => void;
  selectAllDisabled: boolean;
  retryDisabled: boolean;
};

export function FailedPaymentsBanner({
  failedCount,
  selectedCount,
  onSelectAllFailed,
  onRetrySelected,
  selectAllDisabled,
  retryDisabled,
}: FailedPaymentsBannerProps) {
  const heading =
    failedCount === 1 ? "1 failed payment" : `${failedCount} failed payments`;

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-red-200/90 bg-red-50/80 px-5 py-2.5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:border-red-900/55 dark:bg-[oklch(0.17_0.04_22)] dark:backdrop-blur-none"
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

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-red-300/80 bg-red-100/50 font-medium leading-none text-red-950 shadow-none hover:bg-red-100 sm:w-auto dark:border-red-800/60 dark:bg-red-950/30 dark:text-zinc-50 dark:hover:bg-red-950/45"
          disabled={selectAllDisabled}
          onClick={onSelectAllFailed}
        >
          Select All Failed
        </Button>
        <Button
          type="button"
          size="sm"
          className="w-full gap-2 bg-zinc-900 font-medium leading-none text-zinc-50 shadow-sm hover:bg-zinc-800 disabled:opacity-45 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          disabled={retryDisabled}
          onClick={onRetrySelected}
        >
          <RefreshCw className="size-4 shrink-0" aria-hidden />
          <span>Retry Selected ({selectedCount})</span>
        </Button>
      </div>
    </div>
  );
}
