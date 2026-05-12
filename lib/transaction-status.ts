import { TransactionStatus } from "@/types/transaction"

export function isFailedStatus(status: TransactionStatus): boolean {
  return status === TransactionStatus.Failed
}
