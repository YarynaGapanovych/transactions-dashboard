export const TRANSACTION_STATUS = {
  Success: "success",
  Failed: "failed",
  Retrying: "retrying",
} as const

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS]

declare const isoDateTimeBrand: unique symbol

export type IsoDateTime = string & {
  readonly [isoDateTimeBrand]: never
}

export function toIsoDateTime(value: string): IsoDateTime {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`Invalid ISO date: ${value}`)
  }

  return value as IsoDateTime
}

export type Transaction = {
  id: string
  amount: number
  createdAt: IsoDateTime
  status: TransactionStatus
}
