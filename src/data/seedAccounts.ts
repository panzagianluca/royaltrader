import type { Account } from "../store/accountStore"

export const seedAccounts: Account[] = [
  {
    id: "1",
    name: "Demo Account USD",
    currency: "USD",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Test Account EUR",
    currency: "EUR",
    createdAt: new Date().toISOString(),
  },
] 