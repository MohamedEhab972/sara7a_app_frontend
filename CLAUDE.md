# Project Conventions

## Folder Structure

```
src/
├── app/                        # App bootstrap only
│   ├── App.tsx                 # Root component — mounts providers + router
│   └── router.tsx              # createBrowserRouter — all routes live here
├── components/
│   ├── layout/                 # App shells (not reusable across projects)
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── root-layout.tsx
│   │   └── protected-route.tsx
│   └── ui/                     # Reusable primitives — zero business logic
│       ├── button.tsx
│       ├── card.tsx
│       ├── password-input.tsx
│       └── google-button.tsx
├── contexts/                   # React contexts — <domain>.context.tsx
│   └── auth.context.tsx        # exports AuthProvider + useAuth
├── hooks/                      # Custom hooks — use-<name>.ts
│   ├── use-login.ts
│   └── use-google-auth.ts
├── pages/
│   └── <page-name>/            # One folder per page
│       ├── index.tsx           # Page shell — layout + composition only
│       ├── <name>-form.tsx     # Form component (if page has a form)
│       └── <name>.schema.ts    # Zod schema + inferred type (page-local)
├── services/                   # Pure async API functions — no React
│   └── auth.service.ts
├── lib/
│   ├── utils.ts                # cn() and generic helpers
│   ├── api-error.ts            # ApiError class + getErrorMessage()
│   └── schemas/                # Shared Zod schemas used across multiple pages
│       └── index.ts
├── types/                      # Global TypeScript interfaces
│   └── index.ts
├── styles/                     # Tailwind entry point
│   └── index.css
└── main.tsx                    # ReactDOM.createRoot — mounts <App />
```

## Rules

### Layered Architecture (UI ↔ Hooks ↔ Services)

Pages and components are **UI only** — they never call `fetch` or any API directly.

```
src/pages/      →  uses hooks + contexts only
src/hooks/      →  uses services + manages React state
src/contexts/   →  global state shared across the tree
src/services/   →  raw API calls, pure async functions, no React imports
```

- **Services** (`src/services/<domain>.service.ts`): pure `async` functions that call external APIs. No `useState`, no React. Throw on error, return typed data.
- **Hooks** (`src/hooks/use-<name>.ts`): call services, own the `useState`/`useEffect`, expose a clean API to the UI.
- **Pages/Components**: destructure from hooks, render JSX. Zero fetch calls.

### Pages
- Every page lives in `src/pages/<page-name>/index.tsx`
- Export a named function: `export function <PageName>Page()`
- Register the route in `src/app/router.tsx`

### Components
- **UI primitives** (no business logic) → `src/components/ui/`
- **Layout pieces** (header, footer, shells) → `src/components/layout/`
- File name: kebab-case (e.g. `google-button.tsx`)
- Use `React.forwardRef` for elements that accept a `ref`

### Contexts
- One file per domain → `src/contexts/<domain>.context.tsx`
- Each file exports a Provider + a hook (e.g. `AuthProvider`, `useAuth`)
- Providers are registered in `src/app/App.tsx`
- The hook throws if used outside its Provider

### Forms
- Every form uses **react-hook-form** + **zod** via `@hookform/resolvers/zod`
- Each page that has a form gets two extra files: `<name>-form.tsx` + `<name>.schema.ts`
- Shared schemas (used across pages) → `src/lib/schemas/`
- Validation errors are displayed inline under each field via `formState.errors`
- Never use `useState` for field values — react-hook-form owns all form state
- Pattern:
  ```ts
  // <name>.schema.ts
  export const schema = z.object({ email: z.email(), password: z.string().min(6) })
  export type FormData = z.infer<typeof schema>

  // <name>-form.tsx
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  ```
- Zod v4: use `z.email()` not `z.string().email()` (deprecated)

### API Responses & Error Handling

**Unified response shapes** (defined in `src/types/index.ts`):
```ts
// Every successful response from the backend
interface ApiResponse<T = null> { status: number; message: string; data: T }

// Every error response from the backend
interface ApiErrorBody { status: false; message: string; extra: unknown | null; stack: string | null }
```

**Error flow** — hooks never inspect raw Axios errors:
```
API call fails
  → response interceptor (auth.service.ts)
  → extracts err.response.data.message from backend
  → throws ApiError(serverMessage, statusCode)
  → catch (err) in hook
  → toast.error(getErrorMessage(err))   ← shows the real server message
```

**Rules:**
- All API calls use the shared `api` axios instance from `auth.service.ts`
- Never write `catch { toast.error("hardcoded") }` — always use `getErrorMessage(err)`
- Domain response types are aliases of `ApiResponse<T>`:
  ```ts
  type AuthResponse = ApiResponse<{ user: User; tokens: AuthTokens }>
  ```
- For multipart/form-data (file upload) use `FormData` and set `Content-Type: multipart/form-data`

### Notifications
- All user-facing messages use **sonner** (`toast.success`, `toast.error`)
- `<Toaster position="top-right" richColors closeButton />` is mounted once in `App.tsx`
- Never use `alert()` or inline error state for API feedback

### Types
- Shared/global types → `src/types/index.ts`
- Page-local types can live in the page file

### Utilities
- Helper functions → `src/lib/utils.ts`
- `cn()` is the only way to merge Tailwind classes (clsx + tailwind-merge)

### Imports
- Always use the `@/` alias (maps to `src/`) — no relative `../../` imports
- Example: `import { Button } from "@/components/ui/button"`

### Styling
- Tailwind CSS v4 only — no inline styles, no CSS modules
- Dark mode via the custom `dark` variant defined in `src/styles/index.css`

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 |
| React Router | 7 |
| @react-oauth/google | 0.12+ |
| Radix UI | latest |
| lucide-react | latest |
| react-hook-form | latest |
| zod | latest |
| sonner | latest |
| axios | latest |
