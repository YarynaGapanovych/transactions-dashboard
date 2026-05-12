"use client"

import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { TRANSACTION_STATUS, type TransactionStatus } from "@/types/transaction"

const STATUS_LABEL: Record<TransactionStatus, string> = {
  [TRANSACTION_STATUS.Success]: "Success",
  [TRANSACTION_STATUS.Failed]: "Failed",
  [TRANSACTION_STATUS.Retrying]: "Retrying",
}

type TransactionStatusCellProps = {
  status: TransactionStatus
}

export function TransactionStatusCell({ status }: TransactionStatusCellProps) {
  if (status === TRANSACTION_STATUS.Retrying) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200"
      >
        <Loader2
          className="size-3.5 animate-spin text-amber-600 dark:text-amber-300"
          aria-hidden
        />
        {STATUS_LABEL[TRANSACTION_STATUS.Retrying]}
      </Badge>
    )
  }

  if (status === TRANSACTION_STATUS.Failed) {
    return (
      <Badge
        variant="outline"
        className="border-destructive/40 bg-destructive/10 font-medium text-destructive dark:border-red-500/50 dark:bg-destructive/20 dark:text-red-200"
      >
        {STATUS_LABEL[TRANSACTION_STATUS.Failed]}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-500/40 bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-200"
    >
      {STATUS_LABEL[TRANSACTION_STATUS.Success]}
    </Badge>
  )
}
