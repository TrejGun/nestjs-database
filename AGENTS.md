# AGENTS

This file captures project conventions and workflows for humans and AI agents.

## Repo layout
- `apps/mikro-orm`: NestJS API with MikroORM and Postgres.
- `apps/mongoose`: NestJS API with Mongoose and MongoDB.
- `apps/sequelize`: NestJS API with Sequelize and Postgres.
- `apps/type-orm`: NestJS API with TypeORM and Postgres..

## Tooling
- Node.js >= 24 (`.nvmrc`).
- npm workspaces from repo root.

## Formatting and linting
- Prettier settings: double quotes, `printWidth` 120, `trailingComma` all, `arrowParens` avoid.
- Lint staged files with Prettier then ESLint (`.lintstagedrc`).
- ESLint config extends `@ethberry/eslint-config` and should not be customized in `eslint.config.mjs`.

## Naming conventions
- Variables holding DB entities use the `Entity` suffix (e.g., `merchantEntity`).
- Variables holding DB repositories use the `EntityRepository` suffix (e.g., `merchantEntityRepository`).

## Typescript style
- Keep imports grouped by external packages then internal modules.
-
## NestJS modules
- Modules typically include `*.module.ts`, `*.service.ts`, `*.controller.ts`, and `*.entity.ts` files (see `services/server/src/marketplace/showroom`).
- Services are the single point for actions on a model and are used by controllers.
- Inject repositories with `@InjectRepository(Entity)` in services.
- Always add `Logger` to new modules, even if the module is empty.
- DTO should be passed as a single variable, then spread on the first line inside the function.
  - Example (DTO): `create(dto: CreateAssetDto) { const { title, description } = dto; ... }`

## Tests
- Backend tests use Jest with `*.spec.ts` (see `apps/mikro-orm`).
- Seeding in tests uses seed module/service; this is an exception to the single service point rule for model actions.
- Run server tests: `npm run --prefix ./app/mikro-orm test`
