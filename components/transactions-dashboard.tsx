"use client";

import { FileDown, Loader2 } from "lucide-react";
import * as React from "react";
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
import { isFailedStatus } from "@/lib/transaction-status";
import { MOCK_TRANSACTIONS } from "@/lib/mock-transactions";
import { TransactionStatus, type Transaction } from "@/types/transaction";
import { randomRetryDelayMs } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { TransactionStatusCell } from "./transaction-status-cell";

export function TransactionsDashboard() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [rows, setRows] = React.useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedFailed, setSelectedFailed] = useState<Set<string>>(
    () => new Set(),
  );
  const [invoiceLoadingIds, setInvoiceLoadingIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const id = window.setTimeout(() => setInitialLoading(false), 750);
    return () => window.clearTimeout(id);
  }, []);

  const failedIds = useMemo(
    () => rows.filter((r) => isFailedStatus(r.status)).map((r) => r.id),
    [rows],
  );

  const allFailedSelected =
    failedIds.length > 0 && failedIds.every((id) => selectedFailed.has(id));
  const someFailedSelected =
    failedIds.some((id) => selectedFailed.has(id)) && !allFailedSelected;

  function toggleSelectAllFailed(checked: boolean) {
    setSelectedFailed(checked ? new Set(failedIds) : new Set());
  }

  function toggleFailedSelection(id: string, checked: boolean) {
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
    setInvoiceLoadingIds((prev) => new Set(prev).add(id));

    window.setTimeout(() => {
      const lines = [
        `Invoice (mock)`,
        `Transaction: ${tx.id}`,
        `Amount: ${formatCurrency(tx.amount)}`,
        `Date: ${formatDateTime(tx.createdAt)}`,
        "",
        "This is a dummy PDF substitute for demo purposes.",
      ];
      const blob = new Blob([lines.join("\n")], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.txt`;
      a.rel = "noopener";
      a.click();
      URL.revokeObjectURL(url);

      setInvoiceLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      toast.success("Invoice ready", {
        description: `Downloaded invoice-${id}.txt`,
      });
    }, 2000);
  }

  function handleRetrySelected() {
    const ids = rows
      .filter(
        (r) => r.status === TransactionStatus.Failed && selectedFailed.has(r.id),
      )
      .map((r) => r.id);
    if (ids.length === 0) return;

    setRows((prev) =>
      prev.map((t) =>
        ids.includes(t.id) && t.status === TransactionStatus.Failed
          ? { ...t, status: TransactionStatus.Retrying }
          : t,
      ),
    );

    setSelectedFailed((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });

    for (const id of ids) {
      const delayMs = randomRetryDelayMs();
      window.setTimeout(() => {
        const success = Math.random() >= 0.2;
        setRows((prev) =>
          prev.map((t) => {
            if (t.id !== id || t.status !== TransactionStatus.Retrying) return t;
            return {
              ...t,
              status: success
                ? TransactionStatus.Success
                : TransactionStatus.Failed,
            };
          }),
        );
      }, delayMs);
    }
  }

  if (initialLoading) {
    return <TransactionsDashboardSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Transactions Dashboard
        </h1>
      </header>

      {failedIds.length > 0 ? (
        <FailedPaymentsBanner
          failedCount={failedIds.length}
          selectedCount={selectedFailed.size}
          onSelectAllFailed={() => toggleSelectAllFailed(!allFailedSelected)}
          onRetrySelected={handleRetrySelected}
          retryDisabled={selectedFailed.size === 0}
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
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date / time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((tx) => {
              const isFailed = isFailedStatus(tx.status);
              const isRetrying = tx.status === TransactionStatus.Retrying;
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
                        onCheckedChange={(v) =>
                          toggleFailedSelection(tx.id, Boolean(v))
                        }
                        aria-label={`Select failed transaction ${tx.id}`}
                      />
                    ) : (
                      <span className="inline-block w-4" aria-hidden />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
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
                          <Loader2 className="size-3.5 animate-spin" />
                          Generating PDF…
                        </>
                      ) : (
                        <>
                          <FileDown className="size-3.5" />
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
  );
}
