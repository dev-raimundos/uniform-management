## Project Architecture Overview

This project follows a **Feature-Based Modular Architecture** built on **Next.js 15 (App Router)** and **TypeScript**, designed for scalability and maintainability.

### 1. Core Principles

* **Feature isolation:** each business domain lives in its own folder under `/features/`.
* **Shared foundations:** utilities, API client, and UI primitives live in `/shared/`.
* **Explicit boundaries:** UI, business logic, and data fetching are separated by responsibility.
* **Progressive adoption:** allows incremental refactors of legacy modules into modern isolated features.

---

### 2. Folder Structure

```
app/                     # Next.js App Router entrypoints (routes, layouts, pages)
│
├─ features/             # Business features organized by domain
│   └─ auth/             # Example: authentication feature
│       ├─ api/          # API requests related to the feature
│       ├─ hooks/        # React hooks exposing feature logic
│       ├─ store/        # Zustand stores (feature state)
│       ├─ components/   # Feature-specific UI components
│       └─ index.ts      # Barrel file exporting feature surface
│
├─ shared/               # Cross-cutting utilities used by all features
│   ├─ lib/              # Framework-independent logic and helpers
│   │   ├─ api.ts        # Centralized HTTP client (fetch wrapper)
│   │   ├─ cache.ts      # Optional in-memory cache
│   │   └─ ...
│   ├─ ui/               # Reusable UI primitives (Shadcn + Tailwind)
│   ├─ store/            # Global Zustand stores (theme, user, etc.)
│   └─ config/           # Environment variables and runtime configs
│
└─ middleware.ts         # Next.js middleware handling auth and route protection
```

---

### 3. Architectural Layers

| Layer             | Responsibility                                                        | Example                          |
| ----------------- | --------------------------------------------------------------------- | -------------------------------- |
| **Middleware**    | Intercepts requests, validates JWT token, sets authentication cookie  | `middleware.ts`                  |
| **API Layer**     | Defines network communication with the backend                        | `shared/lib/api.ts`              |
| **Features**      | Encapsulates business logic per domain (auth, users, companies, etc.) | `features/auth/`                 |
| **Store**         | Holds reactive global or feature-level state (Zustand)                | `shared/store/user.store.ts`     |
| **Hooks**         | Bridge between UI and data/business logic                             | `features/auth/hooks/useUser.ts` |
| **UI Layer**      | Visual components built with Shadcn + Tailwind                        | `shared/ui/`                     |
| **Shared Config** | Runtime configuration and env validation (Zod)                        | `shared/config/env.ts`           |

---

### 4. Authentication Flow

1. The legacy PHP system authenticates the user and redirects with a **JWT bearer token**.
2. The **Next.js middleware** intercepts the request, extracts the token from the URL, and sets it as an `httpOnly` cookie.
3. On app load, the **`getCurrentUser()`** service calls the backend `/me` endpoint using that cookie.
4. The user data is stored in the **Zustand global store**.
5. Components use **`useCurrentUser()`** to access the authenticated user reactively across the app.
6. On logout, the cookie and store are cleared, and the user is redirected to the PHP login page.

---

### 5. Shared API Client (`shared/lib/api.ts`)

The project uses a single API client to standardize all HTTP requests.

Responsibilities:

* Attach `Authorization` header automatically (in development with `NEXT_PUBLIC_TEST_TOKEN`).
* Set base URL from environment (`NEXT_PUBLIC_API_URL`).
* Manage common headers, credentials, and error handling.

All feature-specific API calls build on top of this client to avoid repetition.

---

### 6. State Management

* **Zustand** is used for both global (`shared/store/`) and feature-level (`features/.../store/`) state.
* Each store defines `setState` and `clearState` functions.
* Stores can optionally persist data using `sessionStorage` if required (for example, persisting the authenticated user).

---

### 7. UI Layer

* Built using **Shadcn UI** and **TailwindCSS**, customized to follow the project’s design tokens.
* All shared components are placed in `shared/ui/`.
* Each feature may have its own UI components for specific domain views.

---

### 8. Configuration & Environment

`shared/config/env.ts` uses **Zod** to:

* Validate environment variables at runtime.
* Ensure URLs are valid and required fields exist.
* Prevent the app from booting with invalid configuration.

Typical variables:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOGIN_URL=https://legacy.example.com/login
NEXT_PUBLIC_TEST_TOKEN=dev-token (optional)
```

---

### 9. Advantages of this Architecture

* **Scalability:** Each feature evolves independently without impacting others.
* **Maintainability:** Clear separation of concerns (API, UI, hooks, store).
* **Reusability:** Shared utilities and UI primitives reduce duplication.
* **Progressive modernization:** Enables gradual migration from legacy PHP to modern front-end.
* **Predictability:** Every feature follows the same structure and conventions.

---

### 10. Summary of Key Concepts

| Concept                     | Purpose                                                           |
| --------------------------- | ----------------------------------------------------------------- |
| **Feature-Based Structure** | Group related code by business domain rather than technical type. |
| **Shared Layer**            | Cross-domain resources reused across the app.                     |
| **Zustand Stores**          | Reactive state containers for user session, theme, filters, etc.  |
| **API Client**              | Unified interface for all backend communication.                  |
| **Middleware**              | Gatekeeper for authentication and route security.                 |
| **Hooks**                   | Simplified access to state and side-effects in UI components.     |

---

This documentation serves as the **technical map of the architecture**, ensuring consistent understanding across the development team and providing a foundation for scaling the front-end modernization of the legacy system.

```
```
