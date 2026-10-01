# Sky — Weather Lookup

An Express API that wraps a weather data proxy, paired with a small
frontend that looks up current conditions by city.

> **Note:** this only works for a limited set of cities, since it's
> backed by freeCodeCamp's own weather proxy
> (`weather-proxy.freecodecamp.rocks`), not a full worldwide weather
> API. It does not support every city in the world — only a small,
> fixed set used for the lesson (e.g. London, Tokyo, New York,
> Chicago, Los Angeles). Searching an unsupported city will show an
> error.

## Features

- `GET /api/weather` — lists supported cities
- `GET /api/weather/:city` — returns live weather data for a city,
  proxied from freeCodeCamp's weather API
- `GET /api/info`, `GET /api/status`, `GET /api/greet/:name`,
  `GET /api/data` — small practice routes covering static JSON
  responses, route parameters, and `app.route()` chaining
- A styled frontend with:
  - A search box and quick-select city chips
  - Dynamic background and hand-drawn SVG icons that change based on
    the weather condition (clear, cloudy, rain, wind, snow)
  - A styled error state for unsupported or unreachable cities

## Project Structure

```
weather-app/
├── public/
│   └── index.html
├── weather.js
├── index.js
├── package.json
└── package-lock.json


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

- `weather.js` defines a router mounted at `/api/weather`. Its dynamic
  `:city` route fetches data from the freeCodeCamp weather proxy and
  reshapes it into a simpler JSON response (`city`, `temperature`,
  `description`).
- The frontend (`public/index.html`) calls that route with `fetch()`,
  then picks a matching SVG icon and background color based on
  keywords in the returned weather description.

## What I Learned

- Building a router (`express.Router()`) that calls an external API
  with `fetch()` inside a route handler
- Route parameters (`:city`, `:name`) and reading them from `req.params`
- `app.route()` for chaining multiple HTTP methods on one path
- Handling both "not found" (bad city name) and "network failure"
  (server unreachable) as two distinct error cases on the frontend