# Project Architecture Overview

This project follows a **Feature-Based Modular Architecture** built on **Next.js 16 (App Router)** and **TypeScript**, designed for scalability, isolation, and long-term maintainability.

---

## 1. Core Principles

* **Feature isolation:** each business domain lives in its own folder under `/src/features/`.
* **Shared foundations:** reusable utilities, API client, and UI primitives live in `/src/shared/`.
* **Explicit boundaries:** UI, business logic, and data fetching are clearly separated.
* **Progressive adoption:** legacy modules can be refactored gradually into isolated modern features.

---

## 2. Folder Structure

```
src/                      
│
├─ app/                   # Next.js App Router entrypoints (routes, layouts, pages)
│
├─ features/              # Business features organized by domain
│   └─ auth/              # Example: authentication feature
│       ├─ api/           # API requests related to the feature
│       ├─ hooks/         # React hooks exposing feature logic
│       ├─ store/         # Zustand stores (feature state)
│       ├─ components/    # Feature-specific UI components
│       └─ index.ts       # Barrel file exporting the feature’s surface
│
├─ shared/                # Cross-cutting utilities used by all features
│   ├─ lib/               # Framework-independent logic and helpers
│   │   ├─ api.ts         # Centralized HTTP client (fetch wrapper)
│   │   ├─ react-query/   # Query client and provider setup
│   │   └─ ...
│   ├─ ui/                # Reusable UI primitives (Shadcn + Tailwind)
│   ├─ store/             # Global Zustand stores (theme, user, etc.)
│   └─ config/            # Environment variables and runtime configs
│
└─ middleware.ts               # Next.js 16 middleware (replaces deprecated middleware)
```

---

## 3. Architectural Layers

| Layer             | Responsibility                                                        | Example                              |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------ |
| **Proxy**         | Intercepts requests, validates JWT token, sets authentication cookie  | `src/middleware.ts`                       |
| **API Layer**     | Defines network communication with the backend                        | `src/shared/lib/api.ts`              |
| **Features**      | Encapsulates business logic per domain (auth, users, companies, etc.) | `src/features/auth/`                 |
| **Store**         | Holds reactive global or feature-level state (Zustand)                | `src/shared/store/user.store.ts`     |
| **Hooks**         | Bridges between UI and data/business logic                            | `src/features/auth/hooks/useUser.ts` |
| **UI Layer**      | Visual components built with Shadcn + Tailwind                        | `src/shared/ui/`                     |
| **Shared Config** | Runtime configuration and environment validation (Zod)                | `src/shared/config/env.ts`           |

---

## 4. Authentication Flow

1. The legacy PHP system authenticates the user and redirects with a **JWT bearer token**.
2. The **Next.js middleware** intercepts the request, extracts the token, and sets it as an `httpOnly` cookie.
3. On app load, the **`getCurrentUser()`** service calls the backend `/me` endpoint using that cookie.
4. The user data is stored in the **Zustand global store**.
5. Components use **`useCurrentUser()`** to access the authenticated user reactively across the app.
6. On logout, both the cookie and store are cleared, and the user is redirected to the PHP login page.

---

## 5. Shared API Client (`src/shared/lib/api.ts`)

A single, strongly typed API client standardizes all HTTP requests.

Responsibilities:

* Automatically attach credentials (`cookies`).
* Inject `Authorization` token in development via `NEXT_PUBLIC_TEST_TOKEN`.
* Set base URL from environment (`NEXT_PUBLIC_API_URL`).
* Handle errors and response normalization consistently.

All feature-specific API calls are built on top of this client to avoid repetition.

---

## 6. State Management

* **Zustand** is used for both global (`src/shared/store/`) and feature-level (`src/features/.../store/`) state.
* Each store exposes `setState()` and `clearState()` methods.
* Stores can persist data using `sessionStorage` when needed (e.g., keeping the authenticated user).

---

## 7. UI Layer

* Built with **Shadcn UI** and **TailwindCSS v4**.
* Global styles are defined in `src/app/globals.css`:

  ```css
  @import "tailwindcss/preflight";
  @import "tailwindcss/utilities";
  ```
* Shared components reside in `src/shared/ui/`.
* Each feature may define its own UI layer for domain-specific needs.

---

## 8. Configuration & Environment

`src/shared/config/env.ts` uses **Zod** for runtime environment validation.

Responsibilities:

* Ensure all required environment variables exist and are valid.
* Prevent app startup with invalid or missing configuration.

Typical `.env.local` example:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOGIN_URL=https://legacy.example.com/login
NEXT_PUBLIC_TEST_TOKEN=dev-token
```

---

## 9. Advantages of this Architecture

* **Scalability:** each feature evolves independently.
* **Maintainability:** strict separation of UI, logic, and data layers.
* **Reusability:** shared utilities and UI primitives reduce duplication.
* **Progressive modernization:** enables stepwise migration from legacy PHP.
* **Predictability:** all features follow the same structure and standards.

---

## 10. Summary of Key Concepts

| Concept                     | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| **Feature-Based Structure** | Group related code by business domain rather than technical layer. |
| **Shared Layer**            | Reusable cross-domain logic and components.                        |
| **Zustand Stores**          | Lightweight reactive state management.                             |
| **API Client**              | Unified abstraction for backend communication.                     |
| **Proxy (Next.js 16)**      | Handles authentication and secure redirects.                       |
| **Hooks**                   | Glue between UI and business logic.                                |

---

### Summary

This documentation describes the **current project architecture (Next.js 16 + Tailwind 4)**
after migrating to the `/src/` directory structure, ensuring a **modular, modern, and maintainable foundation** for continued development and legacy modernization.

