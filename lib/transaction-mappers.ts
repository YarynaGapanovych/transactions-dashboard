import { toIsoDateTime, type Transaction } from "@/types/transaction"
import type { TransactionDto, TransactionsListResponse } from "@/types/api"

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
