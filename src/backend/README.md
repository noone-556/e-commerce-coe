# Backend (Spring Boot)

REST API for the bookshop. Java 21, Spring Boot 4, Spring Data JPA, Flyway, PostgreSQL.

## Run locally
Start the database (`docker compose up -d postgres` from the repo root), then in this folder:
```
.\mvnw spring-boot:run
```
The API is at http://localhost:8080. Try the requests in `requests.http` (VS Code REST Client).

## Structure
```
com.coe.backend
├── catalog/       books and genres: entity, repository, service, controller, dto
└── common/        shared: PageResponse, exceptions, GlobalExceptionHandler
```
A request flows `controller → service → repository → database`, and the result comes back as a DTO.

## Endpoints
| Method | URL | Result |
|---|---|---|
| GET | `/api/categories` | the 5 genres |
| GET | `/api/products?category=&search=&minPrice=&maxPrice=&inStock=&page=&size=&sort=` | one page of books |
| GET | `/api/products/{id}` | one book, or 404 |
| POST | `/api/products` | create, 201 + Location header |
| PUT | `/api/products/{id}` | update |
| DELETE | `/api/products/{id}` | delete, 204 |

Every error uses the same JSON shape (ProblemDetail): `{ title, status, detail, instance }`,
and validation errors add an `errors` map, e.g. `{ "title": "must not be blank" }`.

## Database
Schema changes are Flyway migrations in `src/main/resources/db/migration` (V1, V2, V3...).
Never edit a migration that has already run; add a new one.

## Configuration
All database settings come from environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`),
with local defaults in `application.properties`.

## Docker
`Dockerfile` builds the jar with Maven, then runs it on a small Java 21 runtime as a non-root user.