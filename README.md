# Messaging App (MERN-like with PostgreSQL)
This repository contains a minimal full-stack messaging app scaffold:
- server: Express + Socket.io + PostgreSQL
- client: React (Vite) + Socket.io-client

## Quick start (local)
1. Ensure PostgreSQL is running and create a database, e.g. `messaging_db`.
2. Configure server: copy `server/.env.example` -> `server/.env` and set DATABASE_URL.
3. Install and run server:
   ```
   cd server
   npm install
   npm run dev
   ```
4. Install and run client:
   ```
   cd ../client
   npm install
   npm run dev
   ```
5. Open http://localhost:5173

## Seed data

To populate dummy users/messages/contacts run:

```
cd server
npm run seed
```

Default users created: alice@example.com (password1), bob@example.com (password2), carol@example.com (password3)

# Messaging App (MERN-like with PostgreSQL)

A full-stack messaging application built with a modern web stack using PostgreSQL as the database instead of MongoDB.

## Architecture Overview

### Technology Stack

**Frontend (Client):**
- React (Vite) - UI framework
- Socket.io-client - Real-time communication
- Axios - HTTP client for API calls
- CSS - Styling with WhatsApp-inspired design

**Backend (Server):**
- Express.js - Web server framework
- Socket.io - Real-time bidirectional communication
- PostgreSQL - Relational database
- JWT - Authentication tokens
- bcrypt - Password hashing

### Database Schema

```sql
users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP
)

chats (
  id TEXT PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP
)

messages (
  id SERIAL PRIMARY KEY,
  chat_id TEXT REFERENCES chats(id),
  sender_id INTEGER REFERENCES users(id),
  text TEXT,
  created_at TIMESTAMP
)

contacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  contact_user_id INTEGER REFERENCES users(id),
  nickname TEXT
)```

### API Structure

```
/auth
  POST /login          - User authentication
  POST /register       - User registration

/users
  GET  /me            - Get current user info
  PUT  /:id           - Update user profile
  GET  /all           - Get all users (for contact discovery)

/contacts
  GET  /:userId       - Get user's contacts
  POST /              - Add a new contact
  DELETE /:id         - Remove a contact

/messages
  GET  /:chatId       - Get message history
  POST /              - Send a message (also via Socket.io) ```

###Security Features
```
-JWT-based authentication

-Password hashing with bcrypt

-CORS configuration for cross-origin requests

-SQL injection prevention through parameterized queries

-File upload validation for avatars
```