# General Rules

## Follow existing conventions

- Before introducing a new pattern, read nearby code and search for existing implementations, then follow what the project already does. Change a convention only for a concrete reason.
- Don't mix unrelated refactors or style migrations into a change. Consistency matters more than personal preference.

## Dependencies

- Before adding a dependency, check whether an existing dependency or a platform API already covers it, and weigh its runtime or bundle cost, maintenance, compatibility, and security. Don't add a library for trivial functionality.

## Generated code

- Never hand-edit generated files, such as OpenAPI clients, ORM or GraphQL output, or other codegen. Change the source schema or generator configuration, then rerun the project's generation command.

## Formatting

- Put a blank line before and after any statement that spans multiple lines, such as a wrapped import or a multi-line array or object, except at the start or end of a block. The formatter keeps these blank lines but doesn't add them.

## Comments

- Default to no comment. Add one only when a reader would otherwise misread the line it sits on: a workaround, an external constraint, a local invariant, or a subtle correctness or performance concern. Keep it to a line or two about that code.
- Don't use comments to explain design: no architecture or module-dependency explanations, no security threat walkthroughs, and no descriptions of what other modules or not-yet-written code do. That reasoning belongs in docs, commit messages, or PR descriptions.
- Don't restate the code, and don't delete useful existing comments to save lines.

## Module boundaries

- Every feature module is a platform or a business module. Platform code never imports a business module, and business modules never import each other: move a need two business modules share to the platform, and refer to another business module's record by its id.
- Domain types in `interfaces/` never import from `entities/`, so persistence depends on the domain, not the reverse.

## Configuration

- Read settings through `ConfigService`, never `process.env`. The one exception is `src/mikro-orm.config.ts`: the MikroORM CLI loads it without Nest, and the `mikro-orm` script supplies `.env` with `node --env-file-if-exists`. Add every new variable to `.env.example` in the same change.

## Before finishing

- Run the type checker, the relevant tests, and the linter and formatter through the project's own scripts, narrowest checks first. If a check can't be run, say so instead of assuming it passes.
- Review the change for stray `any` or `as`, error and null handling, types that reflect real domain constraints, unnecessary complexity, and unrelated refactoring.
