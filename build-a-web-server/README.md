# Acme Forrests — Web Server

A simple Node.js web server (no frameworks) that serves a small static
multi-page website, built while learning Node's `http`, `fs`, and `path`
core modules.

## Features

- Custom HTTP server built with Node's built-in `http` module (no Express)
- Static file serving from a `public/` directory
- Correct `Content-Type` headers based on file extension (`.html`, `.css`, `.png`, `.js`)
- Custom `404.html` page for unmatched routes
- Three pages: Home, Products, About — each with a distinct layout
  - Home: hero section with background image and call-to-action button
  - Products: image gallery with hover effects
  - About: split layout with image and text side by side

## Project Structure

```
build-a-web-server/
├── public/
│   ├── index.html
│   ├── products.html
│   ├── about.html
│   ├── 404.html
│   ├── style.css
│   ├── forrest1.png
│   ├── forrest2.png
│   └── forrest3.png
├── server.js
└── package.json
```

## Running Locally

```bash
node server.js
```

Then open [http://localhost:3001](http://localhost:3001) in your browser.
Note: the server won't open your browser automatically, and if port 3001 is already in use on your machine, it will fail to start until that port is freed or the code is changed to use a different one


## What I Learned

- Reading files asynchronously with `fs.readFile`
- Creating a raw HTTP server with `http.createServer`
- Mapping file extensions to MIME types manually
- Setting response status codes and headers with `response.writeHead`
- Structuring CSS to avoid page-specific duplicate classes