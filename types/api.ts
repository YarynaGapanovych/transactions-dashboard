import {
  toIsoDateTime,
  type Transaction,
  type TransactionStatus,
} from "@/types/transaction"

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

export function mapTransactionDtoToTransaction(
  dto: TransactionDto,
): Transaction {
  return {
    id: dto.id,
    amount: dto.amount,
    createdAt: toIsoDateTime(dto.created_at),
    status: dto.status,
  }
}

export function mapTransactionsListResponse(
  response: TransactionsListResponse,
): Transaction[] {
  return response.data.map(mapTransactionDtoToTransaction)
}
