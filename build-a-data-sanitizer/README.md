# Data Sanitizer

An Express app that demonstrates middleware chaining, input cleaning,
and validation — built to practice route-level middleware and custom
error handling in Express.

## Features

- A styled HTML form (served from `public/`) that accepts a username
  and comment
- `inputCleaner` middleware — lowercases the username and strips HTML
  tags from the comment
- `inputValidator` middleware — rejects usernames shorter than 3
  characters and redirects back to the form with an error message
- On success, redirects back to the form with the sanitized data shown
  in a success message
- Errors and success messages are passed through the URL's query
  string and displayed client-side with JavaScript — no server-side
  templating needed

## Project Structure

```
build-a-data-sanitizer/
├── public/
│   └── index.html
├── middleware.js
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
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. `GET /` redirects to `/form`.
2. `GET /form` serves the HTML form.
3. `POST /submit` runs two middleware functions in sequence before the
   final route handler:
   - `inputCleaner` — sanitizes the incoming data and calls `next()`
   - `inputValidator` — checks the cleaned username's length; if it's
     too short, redirects back to `/form` with an error message
     instead of calling `next()`
4. If validation passes, the final handler redirects back to `/form`
   with the sanitized username and comment shown in a success message.

## What I Learned

- Route-level middleware (`app.post(path, middlewareA, middlewareB, handler)`)
- Reading and mutating `req.body` across chained middleware
- Basic regex for stripping HTML tags (`/<[^>]*>/g`)
- Passing data between requests via URL query parameters
  (`encodeURIComponent` / `decodeURIComponent`)
- `express.urlencoded()` vs `express.json()` — parsing form data vs
  JSON request bodies
