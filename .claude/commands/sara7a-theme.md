# Sara7a Design System

Apply these rules to every new component or page you build in this project.

## Brand

- **Name**: Sara7a (صراحة — means "frankness / honesty")
- **Tagline feel**: Open, direct, modern social platform
- **Logo component**: `<Sara7aLogo />` from `@/components/ui/sara7a-logo`
  - Props: `size` ("sm" | "md" | "lg"), `showText` (boolean)
  - Use `size="sm"` in the header
  - Use `size="lg"` on auth pages (login / register / verify)
  - Use `showText={false}` when only the icon mark is needed

## Color Palette — Violet

Primary is a vibrant violet (`oklch(0.606 0.25 292.717)` light / `oklch(0.702 0.183 292.717)` dark).
All tokens live in `src/styles/index.css` under `@theme inline` and `.dark`.

| Token | Light | Dark |
|---|---|---|
| `primary` | rich violet | lighter violet |
| `primary-foreground` | near-white | dark violet |
| `secondary` | soft violet tint | dark violet surface |
| `accent` | hover violet | darker hover |
| `muted` | very pale violet | dark muted |
| `background` | off-white violet | dark indigo-black |
| `border` / `input` | light violet border | dark violet border |

**Rule**: never hard-code hex/rgb colors. Always use Tailwind tokens (`bg-primary`, `text-muted-foreground`, `border-border`, etc.).

## Typography & Spacing

- Font: `system-ui, -apple-system, sans-serif` (already set in body)
- Auth pages max-width: `max-w-sm` card, `py-10` vertical padding
- Section headings: `text-2xl font-bold tracking-tight`
- Sub-labels: `text-sm text-muted-foreground`

## Layout Patterns

### Auth page shell
```tsx
<div className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
  <div className="w-full max-w-sm">
    <div className="mb-8 flex flex-col items-center gap-3">
      <Sara7aLogo size="lg" />
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      {/* form content */}
    </div>
    <p className="mt-4 text-center text-sm text-muted-foreground">
      {/* navigation link */}
    </p>
  </div>
</div>
```

### Form field
```tsx
<div className="flex flex-col gap-1.5">
  <label htmlFor="field" className="text-sm font-medium">Label</label>
  <input
    id="field"
    className="rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
  />
  {error && <p className="text-xs text-destructive">{error.message}</p>}
</div>
```

### Divider with "or"
```tsx
<div className="my-5 flex items-center gap-3">
  <div className="h-px flex-1 bg-border" />
  <span className="text-xs text-muted-foreground">or</span>
  <div className="h-px flex-1 bg-border" />
</div>
```

## Component Conventions

- **Buttons**: always `<Button>` from `@/components/ui/button`
- **Password fields**: always `<PasswordInput>` from `@/components/ui/password-input`
- **Toast messages**: always `toast.success()` / `toast.error()` from `sonner`
- **Errors**: inline under the field, `text-xs text-destructive`
- **Loading spinner**: `<div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />`

## Architecture Reminder

```
pages → hooks → services
```
- Pages render JSX only — no `fetch`, no `axios`
- Hooks own all state — no business logic in pages
- Services are pure async — no React imports
