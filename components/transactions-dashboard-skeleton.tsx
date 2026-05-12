"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SKELETON_ROW_COUNT = 8

export function TransactionsDashboardSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading transactions…</span>
      <header className="space-y-3">
        <Skeleton className="h-9 w-80 max-w-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-22 w-full max-w-6xl rounded-lg" />

        <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4">
                <span className="sr-only">Select failed</span>
                <Skeleton className="size-4 rounded-[4px]" aria-hidden />
              </TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date / time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
              <TableRow key={`skeleton-row-${index}`} className="hover:bg-transparent">
                <TableCell className="pl-4">
                  <Skeleton className="size-4 rounded-[4px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-36 font-mono" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-4xl" />
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Skeleton className="ml-auto h-9 w-38 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
