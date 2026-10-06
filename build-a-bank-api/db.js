import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ACCOUNTS_PATH = join(__dirname, "accounts.json");
const TRANSACTIONS_PATH = join(__dirname, "transactions.json");

export async function getAccounts() {
  const data = await readFile(ACCOUNTS_PATH, "utf8");
  return JSON.parse(data);
}

export async function saveAccounts(accounts) {
  await writeFile(ACCOUNTS_PATH, JSON.stringify(accounts, null, 2));
}

export async function getTransactions() {
  try {
    const data = await readFile(TRANSACTIONS_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeFile(TRANSACTIONS_PATH, JSON.stringify([], null, 2));
      return [];
    }
    throw err;
  }
}

export async function addTransaction(transaction) {
  const transactions = await getTransactions();
  const newTx = {
    id: transactions.length ? Math.max(...transactions.map((t) => t.id)) + 1 : 1,
    timestamp: new Date().toISOString(),
    ...transaction,
  };
  transactions.unshift(newTx);
  await writeFile(TRANSACTIONS_PATH, JSON.stringify(transactions, null, 2));
  return newTx;
}