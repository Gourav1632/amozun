# <img src="frontend/public/images/logo.png" width="40" height="40" align="top" alt="Amozun Logo"> Amozun

> A full-stack, production-ready e-commerce platform with a modern Amazon-style UI, secure payment processing, and a fully automated CI/CD pipeline.

**🚀 Live Demo:** [https://amozun.vercel.app](https://amozun.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Assumptions & Considerations](#assumptions--considerations)

---

## Overview

Amozun is a decoupled e-commerce platform split into a **Next.js frontend** deployed on Vercel and a **Dockerized Express API** running on AWS EC2. It supports full user authentication, product browsing, cart management, and secure Stripe-powered checkout — all delivered with a fast, responsive UI.

---

## Demo Credentials

For review purposes, you can use the following demo account to test out the application without having to sign up:

- **Email:** `demo@amozun.in`
- **Password:** `demo123`

---

## Screenshots

> **Note to Developer:** Take screenshots of your running application and save them to a new `screenshots/` folder in the root directory to display them here!

<details>
<summary>Click to view screenshots</summary>

| Home Page | Product Details |
| :---: | :---: |
| <img src="screenshots/home.png" alt="Home Page" width="400"> | <img src="screenshots/product.png" alt="Product Details" width="400"> |
| **Search Results Grid** | **Shopping Cart & Checkout** |
| <img src="screenshots/search.png" alt="Search Results" width="400"> | <img src="screenshots/cart.png" alt="Cart" width="400"> |

</details>

---

## Architecture

```mermaid
graph TD
    Client[Browser / Mobile] -->|HTTPS| Vercel[Vercel Edge Network]
    Client -->|HTTPS API Calls| Caddy[Caddy Reverse Proxy · EC2]

    subgraph Frontend [Next.js App — Vercel]
        Vercel --> Pages[Static & Server Pages]
        Vercel --> ClientComponents[Client Components]
    end

    subgraph Backend [Dockerized Environment — AWS EC2]
        Caddy -->|Proxy :4000| Express[Express API · Node.js]
        Express <--> Redis[(Redis)]
        Express <--> Postgres[(PostgreSQL)]
    end

    Express -.->|Webhook Events| Stripe[Stripe API]
    Express -.->|Transactional Emails| Resend[Resend API]
```

### How it fits together

| Layer | Technology | Role |
|---|---|---|
| **Edge** | Vercel | Global CDN, static hosting, SSR |
| **Frontend** | Next.js App Router | Hybrid static/dynamic rendering |
| **Reverse Proxy** | Caddy | Auto TLS, routes traffic to Express |
| **API** | Express (TypeScript) | REST endpoints, business logic |
| **Database** | PostgreSQL 15 | Relational data, Kysely migrations |
| **Cache / Sessions** | Redis 7 | OTP storage, short-lived state |

**Key design decisions:**

- **Server Components** handle the initial page render for SEO and performance. Personalized sections (cart, recently viewed) use client-side fetching to avoid stale cached data.
- **Caddy** auto-provisions SSL/TLS certificates and proxies requests to the internal Express container — no manual cert management.
- **Kysely** replaces a heavy ORM with a lightweight, fully type-safe SQL query builder that stays close to the database without sacrificing type safety.

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| Next.js | 16.2 | App Router, SSR/SSG, routing |
| React | 19 | UI component library |
| Tailwind CSS | v4 | Utility-first styling |
| Lucide React | latest | Icon set |
| Swiper | latest | Touch-optimized product carousels |

### Backend

| Package | Version | Purpose |
|---|---|---|
| Express.js | v5 | REST API framework |
| TypeScript | strict | End-to-end type safety |
| PostgreSQL | 15 | Primary relational database |
| Kysely | latest | Type-safe SQL query builder |
| Redis | 7 | OTP and transient state storage |
| bcryptjs | latest | Password hashing |
| jsonwebtoken | latest | Stateless session management |

### Infrastructure & Services

| Tool | Purpose |
|---|---|
| AWS EC2 | Backend host |
| Docker / docker-compose | Container orchestration |
| Caddy | Reverse proxy with auto TLS |
| Vercel | Frontend hosting & CDN |
| Stripe | Payment processing |
| Resend | Transactional email delivery |
| GitHub Actions | CI/CD automation |
| GitHub Container Registry | Docker image storage |

---

## CI/CD Pipeline

Every push to `main` that touches the backend triggers a fully automated, zero-downtime deployment:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant GHA as GitHub Actions
    participant GHCR as Container Registry
    participant EC2 as AWS EC2

    Dev->>GH: Push to `main`
    GH->>GHA: Trigger backend-deploy.yml
    GHA->>GHA: Build Docker image (Buildx)
    GHA->>GHCR: Push ghcr.io/.../amozun-backend:latest
    GHA->>EC2: SSH in
    EC2->>GHCR: docker compose pull api
    EC2->>EC2: docker compose up -d
    EC2->>EC2: docker image prune -f
```

The old container is replaced in-place by `docker compose up -d`, which recreates only changed services — keeping downtime to zero.

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3
- A running PostgreSQL instance
- A running Redis instance

---

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/amozun.git
cd amozun

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

### 2. Configure Environment Variables

**`backend/.env`**

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=amozun
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/amozun
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_super_secret_jwt_key

RESEND_API_KEY=re_your_resend_api_key

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

FRONTEND_URL=http://localhost:3000
PORT=4000
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 3. Migrate & Seed the Database

```bash
cd backend

# Apply Kysely migrations
npm run migrate

# Download the dataset
curl -L -o ~/Downloads/amazon-uk-products-dataset-2023.zip \
  https://www.kaggle.com/api/v1/datasets/download/asaniczka/amazon-uk-products-dataset-2023

# Extract the dataset into the root/backend directory as expected by the script
unzip ~/Downloads/amazon-uk-products-dataset-2023.zip -d .

# Seed 500 product records from the CSV
python3 preprocess.py
```

The seeder script extracts 500 diverse records from `amz_uk_processed_data.csv` to give the platform a realistic, varied product catalog without overloading a development database.

---

### 4. Start Development Servers

```bash
# Terminal 1 — API (http://localhost:4000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

---

## Assumptions & Considerations

**CORS & Cookies** — The API accepts cross-origin requests only from the configured Vercel frontend URL. JWT tokens are stored in `httpOnly` cookies with `sameSite: 'none'` and `secure: true` to support cross-domain authentication.

**Database migrations** — Schema changes are applied via `npm run migrate`, either directly on the host or inside the container during a maintenance window. Kysely tracks migration state automatically.

**Data seeding** — The product catalog is sourced from `amz_uk_processed_data.csv`. The Python seeder chunks and processes exactly 500 records to keep development imports fast while maintaining a realistic catalog.