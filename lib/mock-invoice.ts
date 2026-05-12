import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Transaction } from "@/types/transaction"

const MOCK_INVOICE_DELAY_MS = 2000

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function downloadMockInvoice(tx: Transaction): Promise<string> {
  await wait(MOCK_INVOICE_DELAY_MS)

  const filename = `invoice-${tx.id}.txt`
  const lines = [
    "Invoice (mock)",
    `Transaction: ${tx.id}`,
    `Amount: ${formatCurrency(tx.amount)}`,
    `Date: ${formatDateTime(tx.createdAt)}`,
    "",
    "This is a dummy PDF substitute for demo purposes.",
  ]
  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.rel = "noopener"
  link.click()
  URL.revokeObjectURL(url)

  return filename
}
