import { TRANSACTION_STATUS, type TransactionStatus } from "@/types/transaction"

export function isFailedStatus(status: TransactionStatus): boolean {
  return status === TRANSACTION_STATUS.Failed
}
