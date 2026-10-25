# Family Movie Watchlist API

An Express API where each family member has their own movie watchlist.
Users log in to get a JWT, and role-based rules decide who can change
what: parents can edit anyone's list, children only their own.

## Features

- Login with `bcryptjs`-hashed passwords, returning a signed JWT
- `authenticate` middleware that verifies the token and attaches the
  decoded payload to `req.user`
- `authorizeModification` middleware that enforces the role rules
- Watchlist CRUD routes protected by both middleware
- `helmet` for basic security headers
- Data stored in JSON files in `data/`

## Project Structure

```
├── data/
│   ├── users.json
│   └── watchlists.json
├── middleware/
│   ├── authenticate.js
│   └── authorize.js
├── routes/
│   ├── auth.js
│   └── watchlist.js
├── utils/
│   └── db.js
├── .env
├── index.js
└── package.json
```

## Running Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```
PORT=3000
JWT_SECRET=choose-a-long-random-string
```

Start the server:

```bash
npm start
```

The server runs at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in with `username` and `password`, returns `{ token }` |

Login errors: `400` if a field is missing, `401` for an unknown
username or a wrong password.

### Watchlist

All watchlist routes need an `Authorization: Bearer <token>` header.

| Method | Path | Who can use it |
|---|---|---|
| GET | `/api/watchlist/:userId` | Any logged-in user |
| POST | `/api/watchlist/:userId/movies` | Parent (any user), child (own list only) |
| PUT | `/api/watchlist/:userId/movies/:movieId` | Parent (any user), child (own list only) |
| DELETE | `/api/watchlist/:userId/movies/:movieId` | Parent (any user), child (own list only) |

Error responses use the shape `{ "error": "message" }`:

- `401` for a missing, invalid, or expired token
- `403` with `"Access denied"` when a child targets another user's list

## Example

Log in:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your-username", "password": "your-password"}'
```

Use the returned token:

```bash
curl http://localhost:3000/api/watchlist/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## What I Learned

- Hashing passwords with `bcryptjs` and checking them with `bcrypt.compare`
- Signing and verifying JWTs with `jsonwebtoken`
- Writing middleware that attaches data to `req.user`
- Role-based authorization with a second middleware
- Applying middleware to a whole router with `router.use()`
- Why `.env` values (like `JWT_SECRET`) must be set before login works
- Converting URL params from strings to numbers before comparing ids
