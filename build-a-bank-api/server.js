import express from "express";
import { getAccounts, saveAccounts, getTransactions, addTransaction } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 9000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.set("json spaces", 2);
app.use(express.static(path.join(__dirname, "public")));

app.get("/accounts", async (req, res, next) => {
  try {
    const accounts = await getAccounts();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

app.post("/accounts", async (req, res, next) => {
  try {
    const { owner, balance } = req.body;

    if (!owner || typeof owner !== "string" || !owner.trim()) {
      const err = new Error("Owner name is required");
      err.status = 400;
      throw err;
    }

    if (balance === undefined || isNaN(balance) || balance < 0) {
      const err = new Error("Starting balance must be a non-negative number");
      err.status = 400;
      throw err;
    }

    const accounts = await getAccounts();
    const newId = accounts.length ? Math.max(...accounts.map((a) => a.id)) + 1 : 1;
    const newAccount = { id: newId, owner: owner.trim(), balance: Number(balance) };

    accounts.push(newAccount);
    await saveAccounts(accounts);

    await addTransaction({
      type: "ACCOUNT_CREATED",
      description: `Account #${newId} created for ${newAccount.owner} with $${newAccount.balance.toFixed(2)}`,
      accountId: newId,
      amount: newAccount.balance,
    });

    res.status(201).json(newAccount);
  } catch (err) {
    next(err);
  }
});

app.delete("/accounts/:id", async (req, res, next) => {
  try {
    const accountId = parseInt(req.params.id);
    const accounts = await getAccounts();
    const index = accounts.findIndex((a) => a.id === accountId);

    if (index === -1) {
      const err = new Error("Account not found");
      err.status = 404;
      throw err;
    }

    const [deletedAccount] = accounts.splice(index, 1);
    await saveAccounts(accounts);

    await addTransaction({
      type: "ACCOUNT_DELETED",
      description: `Account #${accountId} (${deletedAccount.owner}) deleted`,
      accountId: accountId,
      amount: deletedAccount.balance,
    });

    res.json({ message: "Account deleted successfully", deletedAccount });
  } catch (err) {
    next(err);
  }
});

app.post("/accounts/:id/deposit", async (req, res, next) => {
  try {
    const accountId = parseInt(req.params.id);
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      const err = new Error("Deposit amount must be a positive number");
      err.status = 400;
      throw err;
    }

    const accounts = await getAccounts();
    const account = accounts.find((a) => a.id === accountId);

    if (!account) {
      const err = new Error("Account not found");
      err.status = 404;
      throw err;
    }

    account.balance += amount;
    await saveAccounts(accounts);

    await addTransaction({
      type: "DEPOSIT",
      description: `Deposited $${amount.toFixed(2)} into Account #${accountId} (${account.owner})`,
      accountId,
      amount,
    });

    res.json({ message: "Deposit successful", account });
  } catch (err) {
    next(err);
  }
});

app.post("/accounts/:id/withdraw", async (req, res, next) => {
  try {
    const accountId = parseInt(req.params.id);
    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      const err = new Error("Withdrawal amount must be a positive number");
      err.status = 400;
      throw err;
    }

    const accounts = await getAccounts();
    const account = accounts.find((a) => a.id === accountId);

    if (!account) {
      const err = new Error("Account not found");
      err.status = 404;
      throw err;
    }

    if (account.balance < amount) {
      const err = new Error("Insufficient funds for withdrawal");
      err.status = 409;
      throw err;
    }

    account.balance -= amount;
    await saveAccounts(accounts);

    await addTransaction({
      type: "WITHDRAWAL",
      description: `Withdrew $${amount.toFixed(2)} from Account #${accountId} (${account.owner})`,
      accountId,
      amount,
    });

    res.json({ message: "Withdrawal successful", account });
  } catch (err) {
    next(err);
  }
});

app.post("/transfer", async (req, res, next) => {
  try {
    const { fromId, toId, amount } = req.body;
    const fromIdNum = parseInt(fromId);
    const toIdNum = parseInt(toId);
    const transferAmount = Number(amount);

    if (isNaN(fromIdNum) || isNaN(toIdNum) || isNaN(transferAmount) || transferAmount <= 0) {
      const err = new Error("Invalid transfer parameters");
      err.status = 400;
      throw err;
    }

    if (fromIdNum === toIdNum) {
      const err = new Error("Cannot transfer to the same account");
      err.status = 400;
      throw err;
    }

    const accounts = await getAccounts();
    const sender = accounts.find((a) => a.id === fromIdNum);
    const recipient = accounts.find((a) => a.id === toIdNum);

    if (!sender || !recipient) {
      const err = new Error("Sender or recipient account not found");
      err.status = 404;
      throw err;
    }

    if (sender.balance < transferAmount) {
      const err = new Error("Insufficient funds");
      err.status = 409;
      throw err;
    }

    sender.balance -= transferAmount;
    recipient.balance += transferAmount;

    await saveAccounts(accounts);

    await addTransaction({
      type: "TRANSFER",
      description: `Transferred $${transferAmount.toFixed(2)} from ${sender.owner} (#${sender.id}) to ${recipient.owner} (#${recipient.id})`,
      fromId: sender.id,
      toId: recipient.id,
      amount: transferAmount,
    });

    res.json({
      message: "Transfer successful",
      senderName: sender.owner,
      recipientName: recipient.owner,
      amountTransferred: transferAmount,
      senderNewBalance: sender.balance,
      recipientNewBalance: recipient.balance,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await getTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Tiny Bank API running on http://localhost:${PORT}...`);
});