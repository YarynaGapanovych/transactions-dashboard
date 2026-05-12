import { MOCK_TRANSACTION_DTOS } from "@/lib/mock-transactions"
import { mapTransactionsListResponse } from "@/lib/transaction-mappers"
import type { ApiResult, TransactionsListResponse } from "@/types/api"
import type { Transaction } from "@/types/transaction"

const INITIAL_LOAD_DELAY_MS = 750

export async function fetchTransactions(): Promise<
  ApiResult<Transaction[]>
> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, INITIAL_LOAD_DELAY_MS)
  })

  const response: TransactionsListResponse = {
    data: MOCK_TRANSACTION_DTOS,
  }

  return {
    ok: true,
    data: mapTransactionsListResponse(response),
  }
}
