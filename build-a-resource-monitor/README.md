# Real-Time System Metrics (WebSocket)

A Node.js server that streams live system metrics to the browser over a
WebSocket connection. Built with the core `http`, `fs`, and `os` modules
plus the `ws` library, with no Express.

## Features

- Plain `http` server that serves the frontend files from `public/`
- WebSocket server attached to the same HTTP server (same port)
- Sends a fresh metrics snapshot to each connected client every second
- Metrics included: load average, free memory, total memory, and
  memory usage percentage
- Cleans up each client's timer when the client disconnects

## Project Structure

```
├── public/
│   ├── index.html
│   └── script.js
├── server.js
└── package.json
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** `package.json` needs `"type": "module"`, since `server.js`
> uses ES Module `import` syntax.

## How It Works

1. The browser requests `/` over normal HTTP. The server reads
   `public/index.html` from disk and sends it back. `script.js` is
   served the same way.
2. `script.js` opens a WebSocket connection to the server. The browser
   sends an HTTP request with an `Upgrade: websocket` header, and the
   server replies with `101 Switching Protocols`.
3. Once connected, the server's `connection` handler starts a
   `setInterval` that calls `socket.send(JSON.stringify(getMetrics()))`
   every 1000 ms.
4. When the client disconnects, the `close` handler calls
   `clearInterval`, so the server doesn't keep sending to a closed
   socket.

### Metrics Payload

Each message is a JSON object shaped like this:

```json
{
  "loadAvg": [0.12, 0.08, 0.05],
  "freeMemMB": "1024",
  "totalMemMB": "8192",
  "memUsagePct": "87.5"
}
```

## What I Learned

- The difference between HTTP (request/response) and WebSocket
  (persistent, two-way connection)
- Attaching a `WebSocketServer` to an existing HTTP server with
  `new WebSocketServer({ server })`
- Pushing data from the server on a timer with `setInterval`
- Clearing the timer in the `close` handler so the server doesn't leak
  intervals
- Reading system information with the `os` module (`loadavg`,
  `freemem`, `totalmem`)