# Web3 Message Signer & Verifier
React (Dynamic Headless) + Node.js/Express + viem

This project implements the full requirements of the take-home assignment:
a headless Dynamic.xyz authentication flow, client-side message signing, and backend signature verification.

---

## 🚀 Overview

This is a full-stack Web3 app that allows a user to:

1. **Authenticate** using a **Dynamic.xyz embedded wallet (headless)** — email → OTP → optional MFA.
2. **Sign any custom message** using the user’s wallet.
3. **Send the message + signature** to a backend endpoint.
4. Backend **recovers the signer** using viem and returns whether the signature is valid.
5. The frontend shows the result and stores **local history** of signed messages.

Both frontend and backend are ready for deployment.

---

## 🧩 Tech Stack

### Frontend

- React 18 + TypeScript
- Dynamic.xyz headless auth (`@dynamic-labs/sdk-react-core`)
- Chakra UI
- React Hook Form + Zod
- React Query
- LocalStorage for history persistence
- Vite

### Backend

- Node.js + Express
- viem (`recoverMessageAddress`)
- Zod validation
- Centralized error handling
- Vitest unit + e2e tests

---

## 📂 Features

### Frontend

- Email → OTP → MFA authentication (headless)
- Shows connected wallet address
- Message signing with Dynamic wallet client
- `POST { message, signature }` to backend
- Validation of signing result (valid/invalid + signer address)
- Local history (persistent)
- 3-step wizard: **Login → Sign → History**

### Backend

- REST endpoint: `POST /verify-signature`
- Zod-validated request body
- Signature recovery via viem
- Returns `{ isValid, signer, originalMessage }`
- Centralized error handling & CORS
- Unit tests for crypto + verification logic

---

## ▶️ Running Locally

### 1. Backend

```bash
cd backend
cp .env.example .env   # set FRONTEND_ORIGIN and PORT if needed
pnpm install
pnpm dev
