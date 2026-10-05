---
paths:
  - "**/*.{ts,tsx}"
---

# TypeScript Rules

Write type-safe TypeScript that is consistent with the existing codebase. The compiler and linters remain authoritative for anything they can enforce mechanically; these rules cover what they can't.

## Type safety

- When a type is genuinely unknown, use `unknown` and narrow it with type guards or schema validation.
- Never weaken an existing type just to make compilation succeed.

## Inference and annotations

- Let TypeScript infer obvious types. Annotate where a type is a contract: exported values, public function parameters and return types, complex callbacks, and domain or external API boundaries.

## Assertions and `satisfies`

- Prefer narrowing (`instanceof`, type guards) over `as`. Never use `as any` or `as unknown as T` to bypass a real type mismatch.
- Use an assertion only for a fact the type system can't express but the surrounding code guarantees. Keep it local and explain non-obvious cases.
- To check an object against a type while keeping its specific inferred types, use `satisfies`, not `as`:

```ts
const handlers = {
  created: handleCreated,
  deleted: handleDeleted,
} satisfies Record<EventType, EventHandler>;
```

## Type design

- Use `interface` for extensible object contracts and class-facing APIs. Use `type` for unions, intersections, mapped, conditional, tuple, function, and derived types. Don't convert existing declarations without a concrete reason.
- Model the domain, not the storage or wire format. Don't make fields optional for convenience; use separate types for lifecycle states, such as `CreateUserInput` and `User`.
- Prefer the simplest type that models the problem. Avoid deeply nested conditional, recursive, or clever type-level code.
- Use generics only when they connect input and output types.

## Null and undefined

- Model absence explicitly and follow the project's convention, such as `Promise<User | null>` for lookups. Don't mix `null` and `undefined` for the same meaning.
- Don't collapse distinct domain states (missing, empty, unknown, invalid) into `null` or `undefined` when they mean different things.

## Unions and enums

- Model multiple known states as discriminated unions, not as objects with many optional properties, and handle them exhaustively.
- When runtime values define the allowed set, derive the type from them instead of maintaining both:

```ts
const userRoles = ['admin', 'member', 'viewer'] as const;
type UserRole = (typeof userRoles)[number];
```

- Prefer string literal unions over `enum`, unless the project already uses enums consistently or needs their runtime behavior. Don't refactor existing enums for this rule.

## Functions, async, and collections

- Use an object parameter when a function takes several related or optional arguments.
- Run independent async work with `Promise.all`, after checking that ordering, rate limits, and transaction semantics allow it.
- Prefer non-mutating transformations for shared data, and use `Map` or `Set` where lookups matter.

## Errors

- Don't swallow errors (`catch { return undefined; }`) unless failure genuinely means absence, and don't catch just to rethrow unchanged.
- When translating an error, keep the original: `new DomainError('Failed to create user', { cause: error })`.
- Don't let low-level infrastructure errors escape through a module's public boundary; translate them at the boundary where they become meaningful. Follow the project's error conventions.

## Runtime validation and configuration

- Types disappear at runtime. Validate untrusted input at system boundaries (network requests and responses, environment variables, URL and form input, browser storage, parsed JSON, files, messages), never with `as`.
- Derive TypeScript types from runtime schemas rather than maintaining both, so they can't drift.
- Treat configuration as external input: load and validate it centrally, once at startup, and don't read environment variables directly from business logic.

## Boundaries

- Don't leak infrastructure types (persistence models, request and response objects, framework types, third-party SDK models) into business logic where a domain type or adapter provides a meaningful boundary. Map explicitly between them.

## Imports and modules

- Files within a module may import each other directly. Across modules, import only from the other module's public API, never its internals, and avoid circular dependencies.
- No wildcard imports. Use a barrel file only to define a module's deliberate public API, never to shorten import paths or re-export everything; barrels invite circular dependencies and extra module loading.
