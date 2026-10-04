# Timestamp Microservice

A small Express API that parses a date (as a date string or a Unix
timestamp) and returns it in two standard formats.

## Endpoints

- `GET /api/` — no date given, returns the current time
- `GET /api/:date` — parses `:date`, which can be either:
  - a date string, e.g. `2015-12-25`
  - a Unix timestamp in milliseconds, e.g. `1451001600000`
- Invalid input returns `{ "error": "Invalid Date" }`

## Example Responses

```
GET /api/1451001600000
{ "unix": 1451001600000, "utc": "Fri, 25 Dec 2015 00:00:00 GMT" }

GET /api/2015-12-25
{ "unix": 1451001600000, "utc": "Fri, 25 Dec 2015 00:00:00 GMT" }

GET /api/
{ "unix": <current timestamp>, "utc": "<current date in UTC>" }

GET /api/not-a-real-date
{ "error": "Invalid Date" }
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

Then open [http://localhost:3000](http://localhost:3000) in your browser,
or query the API directly, e.g. `http://localhost:3000/api/2015-12-25`.

## What I Learned

- Optional route parameters, and how their syntax changed in Express 5
  (`:date?` no longer works — used an array of two route paths calling
  the same handler instead)
- Distinguishing a numeric-timestamp string from a date string before
  passing it to `new Date()`
- Detecting an invalid `Date` object with `isNaN(date.getTime())`
- Recreating `__dirname` in ES Modules with `fileURLToPath` and
  `path.dirname`, since it isn't available by default outside CommonJS