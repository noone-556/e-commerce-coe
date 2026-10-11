# E-Commerce CoE

A full-stack e-commerce app with an Angular frontend, a Spring Boot backend and a PostgreSQL database running in Docker.

| Part | Tech | Location | Port |
|---|---|---|---|
| Frontend | Angular 22 | `src/frontend` | 4200 |
| Backend | Spring Boot 4.1 (Java 21, Maven) | `src/backend` | 8080 |
| Database | PostgreSQL 17 (Docker) | `docker-compose.yml` | 5432 |

## Project structure

```
e-commerce-coe/
├── src/
│   ├── frontend/            Angular app
│   └── backend/             Spring Boot app
│       └── src/main/resources/
│           ├── application.properties
│           └── db/migration/    Flyway SQL migrations (V1__init.sql, ...)
├── docker-compose.yml       PostgreSQL container
├── .env                     Local database credentials (not committed)
├── .env.example             Template for .env
├── .gitignore
└── README.md
```

## Prerequisites

Install these first. Open a **new** terminal after installing so it picks up the changes.

| Tool | Version | Check with |
|---|---|---|
| Git | latest | `git --version` |
| Node.js | 22 LTS or 24 LTS | `node -v` |
| Angular CLI | latest (`npm install -g @angular/cli`) | `ng version` |
| JDK | 21 (e.g. Eclipse Temurin) | `java -version` |
| Docker Desktop | latest, WSL 2 backend | `docker --version` |
| VS Code | latest | — |

You don't need to install Maven. The project includes the Maven wrapper (`mvnw`), which downloads the correct version itself.

### Environment variables (Windows)

- **JAVA_HOME** must point to the JDK 21 folder, for example `C:\Program Files\Eclipse Adoptium\jdk-21.0.x-hotspot`. Don't include `\bin`, quotes or a trailing `\`.
- **Path** must contain `%JAVA_HOME%\bin`, placed above any older Java entries.
- Node.js needs no manual setup. Its installer (or nvm-windows) adds it to `Path`.

Check it in **cmd** with `echo %JAVA_HOME%`, or in **PowerShell** with `echo $env:JAVA_HOME`.

### Docker memory limit (8 GB RAM machines)

Create `C:\Users\<you>\.wslconfig`:

```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
```

Then run `wsl --shutdown` and restart Docker Desktop.

### Recommended VS Code extensions

- Extension Pack for Java (Microsoft)
- Spring Boot Extension Pack
- Angular Language Service
- Container Tools (Microsoft)
- PostgreSQL (Microsoft)

## First-time setup

1. **Clone the repo** to a path without spaces if possible:

   ```cmd
   git clone <repo-url>
   cd e-commerce-coe
   ```

2. **Create `.env`** from the template, then set a password:

   ```cmd
   copy .env.example .env
   ```

   ```
   DB_NAME=coe
   DB_USER=coe
   DB_PASSWORD=coe
   ```

   The backend falls back to `coe` / `coe` / `coe` when these variables aren't set, so keep the same values for local development. If you change them, set the same environment variables for the backend too.

3. **Install the frontend dependencies:**

   ```cmd
   cd src\frontend
   npm install
   cd ..\..
   ```

## Running the project

Start Docker Desktop and wait until it shows **Engine running**. Then use three terminals:

| # | Folder | Command | Ready when you see |
|---|---|---|---|
| 1 | root | `docker compose up -d postgres` | `docker ps` shows `Up (healthy)` |
| 2 | `src\backend` | `mvnw spring-boot:run` | `Started BackendApplication` |
| 3 | `src\frontend` | `ng serve` | `Local: http://localhost:4200/` |

The first backend run takes a few minutes while Maven downloads its dependencies. Flyway applies the migrations in `db/migration` automatically on startup.

### Check that it works

- Frontend: http://localhost:4200
- Backend health: http://localhost:8080/actuator/health should return `{"status":"UP"}`

### Stopping

- Press **Ctrl+C** in the backend and frontend terminals.
- Run `docker compose stop` in the root. Your data is kept in the `pgdata` volume.

## Database

### Connection details

| Setting | Value |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `coe` |
| Username | `coe` |
| Password | value of `DB_PASSWORD` in `.env` |

### Viewing the data

- **VS Code:** PostgreSQL extension → Add Connection → enter the details above.
- **pgAdmin:** Register → Server → enter the details above. Install only pgAdmin, not the PostgreSQL server, which would conflict with Docker on port 5432.
- **Command line:**

  ```cmd
  docker exec -it e-commerce-coe-postgres-1 psql -U coe -d coe
  ```

  Useful commands: `\dt` lists tables, `\d <table>` describes a table, `\q` quits.

### Changing the schema

Never create or change tables by hand. Add a new Flyway migration in `src/backend/src/main/resources/db/migration/`:

```
V2__create_products.sql
V3__create_categories.sql
```

The name needs a capital `V`, the next version number, and **two** underscores. Never edit a migration that has already run. Add a new one instead.

### Resetting the database

This deletes all data:

```cmd
docker compose down -v
docker compose up -d postgres
```

## Troubleshooting

| Error | Fix |
|---|---|
| `The JAVA_HOME environment variable is not defined correctly` | `JAVA_HOME` must point to the JDK 21 folder, without `\bin`. Close and reopen VS Code after changing it. |
| `Failed to configure a DataSource` | PostgreSQL isn't running, or `application.properties` isn't saved. |
| `Connection refused` on port 5432 | Start Docker Desktop, then run `docker compose up -d postgres`. |
| `password authentication failed` | The volume was created with a different password. Reset the database (see above). |
| `Unsupported Database: PostgreSQL` | `pom.xml` is missing the `flyway-database-postgresql` dependency. |
| `Port 8080 / 4200 / 5432 already in use` | Stop the other process using that port, or restart the terminal. |
| `ng : running scripts is disabled` (PowerShell) | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once. |
| Angular says the Node.js version is unsupported | Install Node 22 LTS or newer. |
