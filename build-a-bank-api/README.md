# 🏦 Tiny Bank

A lightweight, full-stack banking web application built with **Node.js**, **Express**, and vanilla **HTML/CSS/JavaScript**. It features a modern promise-based custom modal system, full transaction tracking, file-based persistence, and robust input validation.

---

## ✨ Key Features

- **Account Management**: Create new bank accounts with starting balances and delete existing accounts with a custom confirm modal.
- **Deposit & Withdrawal**: Deposit or withdraw funds inline with instant balance updates and negative-value prevention.
- **Funds Transfer**: Transfer funds securely between two different accounts with real-time feedback and validation.
- **Transaction History**: Automatically logs every creation, deletion, deposit, withdrawal, and transfer with timestamps and visual activity tags.
- **Input & Backend Validation**: Prevents zero, negative, or invalid transactions at both client and server levels.

---

## 📁 Project Structure

```text
tiny-bank/
├── db.js                # Async JSON file-persistence database layer
├── server.js            # Express API server & routes
├── accounts.json        # Data store for user accounts
├── transactions.json    # Data store for transaction audit logs
└── public/
    ├── index.html       # Dashboard (Accounts list, inline deposit/withdraw, history, modal)
    └── transfer.html    # Standalone money transfer page