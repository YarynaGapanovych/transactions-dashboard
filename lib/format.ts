import { formatConfig } from "@/lib/format-config"

const INVALID_DATE_LABEL = "—"

const currency = new Intl.NumberFormat(formatConfig.locale, {
  style: "currency",
  currency: formatConfig.currency,
})

const dateTime = new Intl.DateTimeFormat(formatConfig.locale, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: formatConfig.timeZone,
})

function toDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function formatCurrency(amount: number): string {
  return currency.format(amount)
}

export function formatDateTime(value: Date | string | number): string {
  const date = toDate(value)
  if (!date) return INVALID_DATE_LABEL
  return dateTime.format(date)
}
