"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { FailedPaymentsBanner } from "@/components/failed-payments-banner";
import { TransactionsDashboardSkeleton } from "@/components/transactions-dashboard-skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { downloadMockInvoice } from "@/lib/mock-invoice";
import {
  applyRetryResult,
  getSelectedFailedIds,
  markRowsAsRetrying,
  resolveMockRetryPayment,
} from "@/lib/mock-retry-payments";
import { isFailedStatus } from "@/lib/transaction-status";
import { fetchTransactions } from "@/lib/transactions-api";
import { TRANSACTION_STATUS, type Transaction } from "@/types/transaction";
import { TransactionStatusCell } from "./transaction-status-cell";

export function TransactionsDashboard() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [selectedFailed, setSelectedFailed] = useState<Set<string>>(
    () => new Set(),
  );
  const [invoiceLoadingIds, setInvoiceLoadingIds] = useState<Set<string>>(
    () => new Set(),
  );
  const invoiceLoadingIdsRef = useRef(new Set<string>());

  function beginInvoiceDownload(id: string) {
    if (invoiceLoadingIdsRef.current.has(id)) {
      return false;
    }

    invoiceLoadingIdsRef.current.add(id);
    setInvoiceLoadingIds(new Set(invoiceLoadingIdsRef.current));
    return true;
  }

  function finishInvoiceDownload(id: string) {
    invoiceLoadingIdsRef.current.delete(id);
    setInvoiceLoadingIds(new Set(invoiceLoadingIdsRef.current));
  }

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      const result = await fetchTransactions();
      if (cancelled) return;

      if (result.ok) {
        setRows(result.data);
      } else {
        toast.error("Could not load transactions", {
          description: result.error,
        });
      }

      setInitialLoading(false);
    }

    void loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const failedIds = useMemo(
    () => rows.filter((r) => isFailedStatus(r.status)).map((r) => r.id),
    [rows],
  );

  const hasRetryingRows = useMemo(
    () => rows.some((row) => row.status === TRANSACTION_STATUS.Retrying),
    [rows],
  );

  const allFailedSelected =
    failedIds.length > 0 && failedIds.every((id) => selectedFailed.has(id));
  const someFailedSelected =
    failedIds.some((id) => selectedFailed.has(id)) && !allFailedSelected;

  function toggleSelectAllFailed(checked: boolean) {
    if (hasRetryingRows) return;

    setSelectedFailed(checked ? new Set(failedIds) : new Set());
  }

  function toggleFailedSelection(id: string, checked: boolean) {
    if (hasRetryingRows) return;

    setSelectedFailed((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function handleDownloadInvoice(tx: Transaction) {
    const id = tx.id;

    if (!beginInvoiceDownload(id)) {
      return;
    }

    void downloadMockInvoice(tx)
      .then((filename) => {
        toast.success("Invoice ready", {
          description: `Downloaded ${filename}`,
        });
      })
      .finally(() => {
        finishInvoiceDownload(id);
      });
  }

  function handleRetrySelected() {
    let retryIds: string[] = [];

    setRows((prev) => {
      if (prev.some((row) => row.status === TRANSACTION_STATUS.Retrying)) {
        return prev;
      }

      retryIds = getSelectedFailedIds(prev, selectedFailed);

      if (retryIds.length === 0) {
        return prev;
      }

      return markRowsAsRetrying(prev, retryIds);
    });

    if (retryIds.length === 0) {
      return;
    }

    setSelectedFailed((prev) => {
      const next = new Set(prev);
      retryIds.forEach((id) => next.delete(id));
      return next;
    });

    void Promise.allSettled(
      retryIds.map(async (id) => {
        const { success } = await resolveMockRetryPayment(id);
        setRows((prev) => applyRetryResult(prev, id, success));
      }),
    );
  }

  if (initialLoading) {
    return <TransactionsDashboardSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Transactions Dashboard
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        {failedIds.length > 0 ? (
          <FailedPaymentsBanner
            failedCount={failedIds.length}
            selectedCount={selectedFailed.size}
            onSelectAllFailed={() => toggleSelectAllFailed(!allFailedSelected)}
            onRetrySelected={handleRetrySelected}
            selectAllDisabled={hasRetryingRows}
            retryDisabled={selectedFailed.size === 0 || hasRetryingRows}
          />
        ) : null}

        <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 pl-4">
                  {failedIds.length > 0 ? (
                    <Checkbox
                      checked={allFailedSelected}
                      disabled={hasRetryingRows}
                      indeterminate={someFailedSelected}
                      onCheckedChange={(v) => toggleSelectAllFailed(Boolean(v))}
                      aria-label="Select all failed transactions"
                    />
                  ) : (
                    <span className="text-muted-foreground sr-only">
                      No failed rows
                    </span>
                  )}
                </TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date / time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((tx) => {
                const isFailed = isFailedStatus(tx.status);
                const isRetrying = tx.status === TRANSACTION_STATUS.Retrying;
                const invoiceBusy = invoiceLoadingIds.has(tx.id);

                return (
                  <TableRow
                    key={tx.id}
                    data-state={
                      isFailed && selectedFailed.has(tx.id)
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell className="pl-4">
                      {isRetrying ? (
                        <Loader2
                          className="size-4 animate-spin text-muted-foreground"
                          aria-label="Retry in progress"
                        />
                      ) : isFailed ? (
                        <Checkbox
                          checked={selectedFailed.has(tx.id)}
                          disabled={hasRetryingRows}
                          onCheckedChange={(v) =>
                            toggleFailedSelection(tx.id, Boolean(v))
                          }
                          aria-label={`Select failed transaction ${tx.id}`}
                        />
                      ) : (
                        <span className="inline-block w-4" aria-hidden />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-base">
                      {tx.id}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(tx.createdAt)}
                    </TableCell>
                    <TableCell>
                      <TransactionStatusCell status={tx.status} />
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="min-w-38 gap-1.5"
                        disabled={invoiceBusy}
                        onClick={() => handleDownloadInvoice(tx)}
                      >
                        {invoiceBusy ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Generating PDF…
                          </>
                        ) : (
                          <>
                            <FileDown className="size-4" />
                            Download invoice
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
