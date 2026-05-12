export enum TransactionStatus {
  Success = "success",
  Failed = "failed",
  Retrying = "retrying",
}

export type Transaction = {
  id: string
  amount: number
  createdAt: string
  status: TransactionStatus
}
