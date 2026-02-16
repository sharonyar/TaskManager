# Architecture Rules

- Follow layered architecture:
  - Controllers
  - Services
  - Repositories
  - DTOs
  - Domain Models

- Never access database directly from Controllers.
- Services contain business logic only.
- Controllers must be thin.

- All API responses must use DTOs.
- Never expose domain entities directly.

- Use dependency injection everywhere.
