---
paths: ["shared-resources/src/Modules/AdvancedFilter/**"]
---

- Show a message info that this module will be edited.
- DO NOT modify original implementation. The original/current implementations, structure, architecture must stay.
- Study all files: `shared-resources/src/Modules/AdvancedFilter/Infrastructure/Engines/InvoiceQueryEngine.php`, `shared-resources/src/Modules/AdvancedFilter/Infrastructure/Engines/AdvancedFilterQueryProcessor.php` and all files in this directory: `shared-resources/src/Modules/AdvancedFilter/Infrastructure/SQL`
- Please be extra careful when modifying the logic or updating current code as this is logically working 100%.
- ALL eloquent must be in the `shared-resources/src/Modules/AdvancedFilter/Infrastructure` directory
- Follow DDD and Laravel conventions.
- This is a Hexagonal architecture so please follow that pattern.

## Unit tests for this module

Tests live under `shared-resources/src/Modules/AdvancedFilter/Tests/`, mirroring the
namespace of the class under test (e.g. a class in `Infrastructure/Repository/Eloquent`
gets its test in `Tests/Infrastructure/Repository/Eloquent`).

Every test class in this module extends an Orchestra Testbench base class — never plain
`PHPUnit\Framework\TestCase`. This project standardizes on Testbench (it boots the real
`SharedResourceServiceProvider` app container) even for classes that don't touch the database,
because helpers like `auth()`, `app()`, and facades used inside AdvancedFilter's own infrastructure
(e.g. `AdvancedFilterQueryProcessor::mergeJoins()` calls `auth()->id()`) need a booted container to
resolve, not just a bare PHPUnit test.

There are two base classes to extend, pick based on whether the code under test touches the database:

- **Pure logic, no DB** (SQL value objects, the query processor, engines whose `baseSql()` doesn't
  hit MySQL): extend `BilliftySDK\SharedResources\TestCase\BaseTest` directly. It boots Testbench
  and configures the `testing` DB connection but never queries it unless your test/fixtures do. See
  `Tests/Infrastructure/SQL/RawSqlQueryTest.php`, `SqlFilterRelationTest.php`,
  `SqlLogicalFieldOperatorTest.php`, and `Tests/Infrastructure/Engines/AdvancedFilterQueryProcessorTest.php`
  (which drives the processor through a fake in-test `QueryEngine` implementing the `QueryEngine`
  interface, so the join-resolution/group-compilation logic can be exercised without a real
  `InvoiceQueryEngine`/DB dependency) and `InvoiceQueryEngineTest.php` for the pattern.
- **Eloquent repositories / anything that hits MySQL** (e.g.
  `Infrastructure/Repository/Eloquent/EloquentAdvancedFilterFieldRepository.php`,
  `EloquentAdvancedFilterOptionRepository.php`, or an engine like `InvoiceQueryEngine` whose
  `baseSql()` calls `Workspace::ensureDefaultForUser()`): extend
  `BilliftySDK\SharedResources\TestCase\Migrations\BaseTest` instead (it *is* a `TestCase\BaseTest`
  subclass — this still satisfies "extend `TestCase\BaseTest`"). It additionally restores a SQL
  snapshot before every test via the `RefreshDatabase` trait, so every test starts from a known,
  seeded DB state. Don't downgrade a DB-touching test to plain `TestCase\BaseTest` — it skips the
  snapshot restore and tests will pollute each other's data across runs.

### Building test data

Don't hand-roll fixture rows. Use the scenario/builder classes in `shared-resources/src/TestCase/`:

- `TestCase\Scenario\CreateInvoice` — one-shot scenario that creates a plan, user (+ default
  workspace, logged in via `Auth::login`), business profile, client, invoice template/category,
  color scheme, currency, and an invoice with two items, and returns a `TestScenarioCollection`
  (array-accessible: `$this->scenario['invoice']`, `$this->scenario['workspace']`, etc). This is the
  fastest way to get a fully wired invoice for AdvancedFilter repository/engine tests — see
  `Modules/Invoicing/Tests/Repository/Eloquents/InvoiceRepositoryTest.php` and this module's
  `Tests/Infrastructure/Repository/Eloquent/EloquentAdvancedFilterOptionRepositoryTest.php` for the
  pattern:
  ```php
  protected function setUp(): void
  {
      parent::setUp();
      $this->scenario = (new CreateInvoice())();
      $this->repo = app(EloquentAdvancedFilterOptionRepository::class);
  }
  ```
- `TestCase\Builders\*` (e.g. `InvoiceBuilder`, `InvoiceItemsBuilder`, `ClientBuilder`,
  `BusinessProfileBuilder`, `WorkspaceBuilder`, `UserBuilder`, `PlanBuilder`, `CurrencyBuilder`,
  `InvoiceTemplateBuilder`, `InvoiceTemplateCategoryBuilder`, `ColorSchemeBuilder`) — use these
  directly (as `CreateInvoice` does) when you need a record with non-default relations/values, or a
  second record of the same type. Most builders expose fixed fields (e.g. `ClientBuilder` always
  creates "Cris Pepper", `BusinessProfileBuilder` always "JDoe Trading LLC"); when a test needs a
  *second*, differently-named record (e.g. to prove a search filter excludes the wrong one), create
  it with a direct Eloquent `Model::create([...])` call scoped to the same `workspace_id`, the same
  way `InvoiceRepositoryTest::createInvoiceForAnotherUser()` and
  `EloquentAdvancedFilterOptionRepositoryTest` do it. Don't modify the shared builders/concerns just
  to parameterize one test's fixture data.
- For AdvancedFilter field/operator metadata (`AdvancedFilterField`, `AdvancedFilterFieldOperator`,
  `AdvancedFilterOperator`), there is no builder yet — seed via
  `Database\Seeders\AdvancedFilterSeeder` or insert rows directly through the Eloquent models under
  test, matching the shape used in the seeder.

### Known quirks pinned by tests (do not "fix" without asking)

- `AdvancedFilterQueryProcessor`'s where-group compilation double-wraps in parens: each group is
  joined with `AND` and wrapped in its own `(...)`, and then *all* groups are joined with `OR` and
  wrapped in one more outer `(...)`. So even a single condition in a single group compiles to
  `((col = ?))`, not `(col = ?)`. See the assertions in `AdvancedFilterQueryProcessorTest`.
- `SqlFilterRelation::field()` is typed to return `?SqlFilterFieldDefinition`, but that class does
  not exist anywhere in `shared-resources` and nothing calls `field()` with a sub field that would
  return non-null. Calling it for a defined sub field throws `Error: Class ... SqlFilterFieldDefinition
  not found`. It's dead/unused code — `SqlFilterRelationTest` pins this so a future change doesn't
  silently "start working" without anyone noticing the missing class.

### Running tests

Use the `run-test` skill, or manually inside the `backend` container:
`cd ../shared-resources && composer test -- <path/to/FooTest.php>` (omit the path to run the whole
suite via `bin/phpunit-by-class`).