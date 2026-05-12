import { TransactionStatus, type Transaction } from "@/types/transaction";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_8f2k9q1m",
    amount: 129.0,
    createdAt: "2026-05-10T14:32:00Z",
    status: TransactionStatus.Success,
  },
  {
    id: "txn_3v7nw2xr",
    amount: 49.99,
    createdAt: "2026-05-10T12:05:22Z",
    status: TransactionStatus.Failed,
  },
  {
    id: "txn_1h4bz9pd",
    amount: 210.5,
    createdAt: "2026-05-10T11:18:44Z",
    status: TransactionStatus.Failed,
  },
  {
    id: "txn_6wq9lm3k",
    amount: 18.0,
    createdAt: "2026-05-09T22:41:09Z",
    status: TransactionStatus.Success,
  },
  {
    id: "txn_9p2x7n0s",
    amount: 76.25,
    createdAt: "2026-05-09T19:12:33Z",
    status: TransactionStatus.Success,
  },
  {
    id: "txn_4k8rj2vb",
    amount: 340.0,
    createdAt: "2026-05-09T09:55:18Z",
    status: TransactionStatus.Failed,
  },
  {
    id: "txn_7dn3hq5w",
    amount: 12.5,
    createdAt: "2026-05-08T16:27:01Z",
    status: TransactionStatus.Failed,
  },
  {
    id: "txn_2yt6mp8c",
    amount: 55.0,
    createdAt: "2026-05-08T08:03:55Z",
    status: TransactionStatus.Success,
  },
];
