# Messaging App - Server
## Setup
1. Copy `.env.example` to `.env` and set DATABASE_URL to your Postgres connection string.
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Start server:
   ```
   npm run dev
   ```
Server runs on port specified in `.env` (default 4000). It uses Socket.io and a simple Postgres schema created at startup.
