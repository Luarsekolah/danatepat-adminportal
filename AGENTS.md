# Presidana Admin

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 7 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Research & Implementation

- When implementing new features, use `context7` MCP to fetch relevant package documentation
- Review official React, TypeScript, and library docs before coding
- Understand component patterns and hooks thoroughly before implementation
- Follow established patterns from the existing codebase
- Dont't need to create any markdown documentation after the implementation, unless it's a tricky part of the implementation

## Code Formatting

- Avoid nested ternary operators or nested if-else statements as far as possible
- Prefer `Boolean(value)` over `!!value` for boolean checks
- For TanStack Query hooks usage, prefer `const anyData = useAnyData()` then `anyData.data`, `anyData.isLoading`, `anyData.error` over `const { data, isLoading, error } = useAnyData()`

## API Integration

- Use Axios for HTTP requests in `client/services/api.ts`
- Implement TanStack Query query data hooks in `client/services/queries/`
- Implement TanStack Query mutation data hooks in `client/services/mutations/`
- Save the API routes name and TanStack Query key in `client/services/api-config.ts`
- Follow the established API configuration patterns
- Use proper error handling with the error utilities

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```
