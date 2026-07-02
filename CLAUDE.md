# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Dash Accounting System V2 is a multi-tenant simple ledger + time-tracking system for small businesses. It is an ASP.NET Core 8 Web API back end paired with a React 18 / Redux SPA front end, orchestrated locally with .NET Aspire and backed by PostgreSQL.

## Solution Layout

The Visual Studio solution is `src/DashAccountingSystemV2.sln` and contains five projects:

- **`src/BackEnd`** (`DashAccountingSystemV2.BackEnd.csproj`) — ASP.NET Core Web API (`net8.0`). The core of the system.
- **`src/FrontEnd`** (`.esproj`) — React 18 + TypeScript SPA created with Create React App (`react-scripts`). Not built by `dotnet build`; managed via npm.
- **`src/Infrastructure/DashAccountingSystemV2.Aspire.AppHost`** — .NET Aspire orchestrator that launches the back end and the npm front end together.
- **`src/Infrastructure/DashAccountingSystemV2.Aspire.ServiceDefaults`** — shared Aspire service defaults (telemetry, health checks, service discovery).
- **`test/DashAccountingSystemV2.Tests`** — xUnit test project.

## Build & Run

```bash
# Back end (from src/BackEnd)
dotnet build
dotnet run                       # runs the API alone; https://localhost:7252, http://localhost:5208, Swagger at /swagger

# Front end (from src/FrontEnd)
npm install
npm start                        # dev server at https://localhost:3000, proxies API to https://localhost:7252
npm run build                    # production build into FrontEnd/build

# Full stack via Aspire (from src/Infrastructure/DashAccountingSystemV2.Aspire.AppHost) — preferred for running everything
dotnet run                       # starts BackEnd + FrontEnd together with the Aspire dashboard
```

The front-end dev server requires HTTPS certs at the paths in `src/FrontEnd/.env.local` (`C:\Certificates\localhost-ui-*.pem`). The back end also references the front-end `.esproj` and uses `Microsoft.AspNetCore.SpaProxy`, so running the back end from an IDE can auto-launch `npm start`.

## Test & Lint

```bash
# Back-end tests (from repo root or test project)
dotnet test                                          # runs all xUnit tests
dotnet test --filter "FullyQualifiedName~AccountRepositoryFixture"   # single test class
dotnet test --filter "Name=SomeTestMethodName"       # single test

# Front-end (from src/FrontEnd)
npm test                         # Jest via react-scripts (watch mode)
npm run lint                     # eslint over src (never fails the shell — `|| exit 0`)
npm run lint:fix                 # eslint --fix
```

**Back-end tests require a live PostgreSQL database.** Test classes are named `*Fixture` (not `*Tests`), and many exercise real repository code against the database configured in `test/DashAccountingSystemV2.Tests/appsettings.UnitTests.json`. `TestUtilities` runs `EnsureCreatedAsync` + `MigrateAsync` and serializes DB-touching tests with a shared `DatabaseSyncLock`. Tests that mock all repositories can run without the lock via `TestUtilities.RunCommonTestAsync`.

## Configuration & Secrets

- The DB **password** is never in `appsettings*.json`. It is supplied out-of-band and merged into the Npgsql connection string at startup: back end reads `DashAccountingDbPassword`, tests read `DbPassword`. Both use .NET **user-secrets** (see `UserSecretsId` in each `.csproj`). Set via `dotnet user-secrets set "DashAccountingDbPassword" "..."`.
- Connection string base lives in `appsettings.Development.json` (back end) and `appsettings.UnitTests.json` (tests). Default local Postgres: `localhost:5432`, DB `dash_accounting`.
- EF Core migrations live in `src/BackEnd/Data/Migrations`. Run `dotnet ef migrations add <Name>` / `dotnet ef database update` from `src/BackEnd`.

## Back-End Architecture

Strict layered flow — **Controller → Business Logic → Repository → EF Core `ApplicationDbContext`**. Do not skip layers (e.g., controllers should not touch repositories or the DbContext directly).

- **Controllers** (`Controllers/`) are thin. They validate the incoming ViewModel, map it to a domain Model, call a business-logic method, and translate the result to HTTP via the `this.Result(...)` extension. Decorated with `[ApiAuthorize]` and `[Route("api/...")]`.
- **Business Logic** (`BusinessLogic/`) contains one `I{X}BusinessLogic` + `{X}BusinessLogic` per domain area, plus **Façades** (e.g. `PaymentFacade : IPaymentFacade`) that compose multiple business-logic objects into higher-level operations. All return `BusinessLogicResponse` / `BusinessLogicResponse<T>`.
- **Repositories** (`Repositories/`) own all data access (EF Core + some Dapper). One interface + impl per aggregate.
- **`BusinessLogicResponse`** carries `IsSuccessful`, an `ErrorType` enum, and error messages instead of throwing across layers. `ControllerExtensions.Result(...)` converts it to `IActionResult`, and `MapBusinessLogicErrorTypeToHttpStatus` maps `ErrorType` → HTTP status (Conflict→409, RequestedEntityNotFound→404, RequestNotValid→400, UserNotAuthorized→403, RuntimeException→500). When adding an error case, add it to `ErrorType` and this mapping.
- **Models vs ViewModels vs DTOs**: `Models/` are domain entities (mapped by EF). `ViewModels/` are the API request/response shapes, each typically with static `FromModel`/`ToModel` mappers and a `Validate(ModelState)` method. DTOs (`*Dto`) are for reporting/query projections.
- **Dependency injection**: each layer self-registers through an `AddX()` extension in its `ConfigurationExtensions.cs` (`AddRepositories()`, `AddBusinessLogic()`, `AddCaching()`, `AddExportService()`, etc.), all called from `Program.cs`. Register new services in the matching extension, not inline in `Program.cs`.
- **Multi-tenancy**: nearly every entity and route is scoped to a `tenantId` (GUID). Domain routes look like `api/{area}/{tenantId:guid}/...`.
- **Authentication/Authorization** (`Security/`): a custom composite scheme (`ApplicationAuthenticationHandler`) forwards to ASP.NET Identity **Bearer** tokens for normal API calls, plus a separate one-time **export-download token** scheme/policy for file downloads. Uses ASP.NET Core Identity with custom `ApplicationUser`/`ApplicationRole` (GUID keys) and custom managers. Custom claim types are in `Security/Constants.cs`.
- **Exports & Templates** (`Services/`): Excel reports via `ClosedXML.Report` from `.xlsx` templates in `Services/Export/ExcelTemplates`; PDFs via `Select.HtmlToPdf` rendered from Razor (`.cshtml`) templates run through `RazorLight` in `Services/Template/RazorTemplates`. These template files are copied to the output dir by post-build `Copy` targets in the `.csproj` — new templates must match the `*.xlsx` / `*.cshtml` include globs.
- **Money & dates**: monetary values use an `Amount`/`AmountType` model (not raw decimals in APIs); dates use `NodaTime`. Logging is Serilog to console.

## Front-End Architecture

React 18 + TypeScript, Redux (classic, not Toolkit) with `redux-thunk`, `reactstrap`/Bootstrap 5, `react-router-dom` v6, Luxon for dates. Entry at `src/index.tsx`; app shell in `src/app`.

- **Feature-based structure** under `src/features/` (`accounting`, `invoicing`, `sales`, `time-tracking`, `dashboard`, `user-profile`). `accounting` is further split into `balance-sheet`, `chart-of-accounts`, `general-ledger`, `journal`, `profit-and-loss`.
- Each feature/sub-feature folder follows a consistent triad:
  - `models/` — TypeScript interfaces (`*.model.ts`) with an `index.ts` barrel.
  - `redux/` — `{feature}.actions.ts` (action type constants + action interfaces), `{feature}.actionCreators.ts` (thunks that call the API), `{feature}.reducer.ts`, and an `index.ts` barrel.
  - `{feature}Page.tsx` — the page component(s).
- **Cross-cutting Redux** lives in `src/app` (`applicationRedux`, `authentication`, `export`, `lookupValues`, `notifications`) and the store is assembled in `src/app/globalReduxStore/configureStore.ts`. Shared UI, models, and helpers live in `src/common`.
- The dev server proxies API requests to the back end (`"proxy": "https://localhost:7252"` in `package.json`).
- **ESLint is strict and opinionated** (Airbnb + custom rules in `package.json`'s `eslintConfig`): enforced import ordering/alphabetization, one JSX prop per line, alphabetized JSX props, one import/export specifier per line, mandatory member-delimiter semicolons, 4-space JSX indent. Match the surrounding style and run `npm run lint:fix` before finishing front-end work.

## API Testing

A Postman collection and local environment are in `test/Postman/` for manual API exploration.
