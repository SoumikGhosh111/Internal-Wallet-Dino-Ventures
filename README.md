# Internal Wallet 

Internal Wallet is a robust backend solution for managing virtual game assets (Gold, Diamonds, etc.) with a focus on financial integrity, concurrency safety, and high-performance throughput.

## Features

* **Atomic Transactions**: Uses `prisma.$transaction` with row-level locking to prevent double-spending.
* **Double-Entry Accounting**: Every user credit is backed by a system treasury debit for 100% auditability.
* **Bonus-First Logic**: Automatically prioritizes bonus balances over primary balances during spending.
* **Dual-Layer Rate Limiting**: 
    * Global protection (100 req / 15 min).
    * Strict transaction throughput (5 req / 1 sec).
* **Precision Math**: Handles currency using Decimal types to avoid floating-point errors.

## Prerequisites

* [Node.js](https://nodejs.org/) v20.19.0
* [PostgreSQL](https://www.postgresql.org/) (Database name: `internal_wallet_db`)
* [Prisma](https://www.prisma.io/)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```bash
npm install
```

## Setup
1. Create a .env file in the root directory

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/internal_wallet_db"
PORT=3000
```


2. Push the schema and generate the client

```bash
npx prisma db push
npx prisma generate
```


3. Create the System Treasury and test users

```bash
npm run seed
```


## Usage

Start the development server

```bash
npm run dev
```

## API Documentation

1. Top-Up Wallet
Endpoint: /api/v1/wallet/top-up
Description: Purchase assets. Moves funds from the System Treasury to a User's primary balance.
```bash
curl -X POST http://localhost:3000/api/v1/wallet/top-up \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-123",
    "assetType": "GOLD_COINS",
    "amount": 100
  }'
```

2. Issue Bonus
Endpoint: /api/v1/wallet/bonus

Description: Issue incentives. Moves funds from Marketing to the User's bonus balance.

```bash
curl -X POST http://localhost:3000/api/v1/wallet/bonus \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-123",
    "assetType": "GOLD_COINS",
    "amount": 25
  }'
```

3. Spend Assets
Endpoint: /api/v1/wallet/spend

Description: Purchase items. The system automatically exhausts the Bonus balance before touching the Primary balance.

```bash
curl -X POST http://localhost:3000/api/v1/wallet/spend \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-123",
    "assetType": "GOLD_COINS",
    "amount": 50
  }'
```


