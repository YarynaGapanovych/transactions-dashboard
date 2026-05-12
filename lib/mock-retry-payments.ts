import { randomRetryDelayMs } from "@/lib/utils"
import { TRANSACTION_STATUS, type Transaction } from "@/types/transaction"

const MOCK_RETRY_FAILURE_RATE = 0.2

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function getSelectedFailedIds(
  rows: Transaction[],
  selectedFailed: Set<string>,
): string[] {
  return rows
    .filter(
      (row) =>
        row.status === TRANSACTION_STATUS.Failed && selectedFailed.has(row.id),
    )
    .map((row) => row.id)
}

export function markRowsAsRetrying(
  rows: Transaction[],
  ids: string[],
): Transaction[] {
  return rows.map((row) =>
    ids.includes(row.id) && row.status === TRANSACTION_STATUS.Failed
      ? { ...row, status: TRANSACTION_STATUS.Retrying }
      : row,
  )
}

export function applyRetryResult(
  rows: Transaction[],
  id: string,
  success: boolean,
): Transaction[] {
  return rows.map((row) => {
    if (row.id !== id || row.status !== TRANSACTION_STATUS.Retrying) {
      return row
    }

    return {
      ...row,
      status: success ? TRANSACTION_STATUS.Success : TRANSACTION_STATUS.Failed,
    }
  })
}

export async function resolveMockRetryPayment(
  id: string,
): Promise<{ id: string; success: boolean }> {
  await wait(randomRetryDelayMs())
  const success = Math.random() >= MOCK_RETRY_FAILURE_RATE
  return { id, success }
}
