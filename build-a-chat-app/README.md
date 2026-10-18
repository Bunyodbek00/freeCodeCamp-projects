# 💬 Real-Time WebSocket Chat Application

A lightweight, full-duplex real-time chat application built using **Node.js**, **HTTP**, and native **WebSockets** (`ws`). It features real-time messaging, a active user directory, typing indicators, timestamped events, and message history for new connections.

---

## ✨ Features

- **⚡ Real-Time Messaging:** Instant bidirectional communication powered by WebSockets.
- **👥 Active User Directory:** A dynamic sidebar showing all currently connected users.
- **⌨️ Typing Indicators:** Real-time notifications showing when another user is actively typing.
- **📜 Message History:** New users automatically receive the last 50 messages upon joining.
- **🕒 Timestamps:** All chat and system notifications are stamped with precise connection times.
- **🔔 System Notifications:** Broadcasts automated alerts when users join or leave the chat room.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, `http`, `ws` library
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6)

---

## 📁 Project Structure

```text
├── public/
│   ├── index.html    # Layout and CSS styling
│   └── script.js     # Client-side WebSocket event handling & DOM updates
├── server.js         # HTTP and WebSocket server logic
├── package.json      # Dependencies and scripts
└── README.md         # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone or download the project files** into your local directory.
2. **Install dependencies:**
   ```bash
   npm install ws
   ```

### Running the Application

1. **Start the server:**
   ```bash
   node server.js
   ```
2. **Open the App:**
   Navigate to [http://localhost:3001](http://localhost:3001) in your browser.

> 💡 **Tip:** Open two or more browser tabs side-by-side to test real-time chat, join/leave system alerts, typing indicators, and active user updates!

---

## 📡 WebSocket Event Payload Types

The server and client exchange JSON objects with the following event structures:

| Type | Payload Direction | Description |
| :--- | :--- | :--- |
| `system` | Server ➔ Client | Broadcasts user join/leave notifications. |
| `chat` | Client ⇄ Server | Relays chat messages between users. |
| `users` | Server ➔ Client | Updates the list of active connected usernames. |
| `typing` | Client ⇄ Server | Relays typing indicator status to active peers. |
| `history` | Server ➔ Client | Delivers up to 50 previous room messages to a new user. |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).