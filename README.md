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

##API Documentation

```bash
/api/v1/wallet/top-up,POST,Purchase assets (Treasury -> User)
/api/v1/wallet/bonus,POST,Issue incentives (Marketing -> User Bonus)
/api/v1/wallet/spend,POST,Purchase items (Uses Bonus first)
```


## Example Request

```bash
{
  "userId": "uuid-here",
  "assetType": "GOLD_COINS",
  "amount": 50
}
```


