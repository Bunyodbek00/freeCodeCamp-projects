# Random Joke Server

A simple Express.js web app that serves random programming jokes. Built
while learning Express basics — routes, JSON responses, and serving
static files.

## Features

- Single-page frontend with buttons (no page reloads)
- `GET /joke` — returns a random joke as JSON
- `GET /about` — returns info about the app as JSON
- Static files (HTML/CSS/JS) served from a `public/` folder via `express.static()`

## Project Structure

```
build-a-random-joke-app/
├── public/
│   ├── index.html
│   ├── style.css
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

## How It Works

- `server.js` sets up an Express app with two JSON API routes (`/joke`,
  `/about`) and serves the `public/` folder as static files.
- `public/script.js` runs in the browser. It listens for button clicks,
  calls `fetch()` on the API routes, and updates the page content
  without reloading.

## What I Learned

- Setting up routes with Express (`app.get`)
- Sending JSON responses with `res.json()`
- Serving static files with `express.static()`
- Fetching data from the frontend with `fetch()` and `async/await`
