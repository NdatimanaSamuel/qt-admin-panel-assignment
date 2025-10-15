Ndatimana Samuel  
---

## 🧩 Overview

- **Backend:** NestJS + Prisma + SQLite  
- **Frontend:** React + TypeScript (Vite)  
- **State Management:** Redux Toolkit  
- **Styling:** Tailwind CSS 
  
Implements:
- User CRUD (SQLite + Prisma)
- Weekly user stats (chart)
- Protobuf export
- SHA-384 hashing + RSA signature verification

---
## ⚙️ Backend Setup (NestJS)

### 1️⃣ Create `.env`
DATABASE_URL="file:./prisma/dev.db"

### 2️⃣ Install & Run
```bash
cd backend
yarn add
npx prisma generate
yarn start:dev
Runs at http://localhost:3000

Crypto Flow

    Backend:

    Hashes email with SHA-384

    Signs hash using RSA private key

    Stores the public key and exposes it via /users/public-key

Frontend:

        Fetches users (protobuf)

        Verifies each user's signature using the public key

        Displays only users with valid signatures

Protobuf Schema (frontend/public/user.proto)

syntax = "proto3";
package user;

message User {
  int32 id = 1;
  string email = 2;
  int32 role = 3;
  int32 status = 4;
  string createdAt = 5;
  string signature = 6;
}
message UserList {
  repeated User users = 1;
}

Features

    CRUD with SQLite (via Prisma)

    Graph of users created in last 7 days

    /users/export returns Protobuf data

    Frontend verifies digital signatures

Run Summary

# Backend
cd backend
yarn install
npx prisma generate
yarn start:dev

# Frontend
cd ../frontend
yarn install
npm run dev
