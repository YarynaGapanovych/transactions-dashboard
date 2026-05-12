import type { TransactionStatus } from "@/types/transaction"

export type TransactionDto = {
  id: string
  amount: number
  created_at: string
  status: TransactionStatus
}

export type TransactionsListResponse = {
  data: TransactionDto[]
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
