"use client"

import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { TransactionStatus } from "@/types/transaction"

const STATUS_LABEL: Record<TransactionStatus, string> = {
  [TransactionStatus.Success]: "Success",
  [TransactionStatus.Failed]: "Failed",
  [TransactionStatus.Retrying]: "Retrying",
}

export function TransactionStatusCell({ status }: { status: TransactionStatus }) {
  if (status === TransactionStatus.Retrying) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200"
      >
        <Loader2
          className="size-3 animate-spin text-amber-600 dark:text-amber-300"
          aria-hidden
        />
        {STATUS_LABEL[TransactionStatus.Retrying]}
      </Badge>
    )
  }

  if (status === TransactionStatus.Failed) {
    return (
      <Badge variant="destructive" className="font-medium">
        {STATUS_LABEL[TransactionStatus.Failed]}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-500/40 bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-200"
    >
      {STATUS_LABEL[TransactionStatus.Success]}
    </Badge>
  )
}
