# 🥗 DietApp Backend

This project is the backend service for a multi-tenant dietitian app, written in Go, using Gin as the web framework and PostgreSQL as the database.

---

## 🚀 Quick Start

### Prerequisites

- [Go](https://golang.org/) 1.24 or higher
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [`golang-migrate`](https://github.com/golang-migrate/migrate) installed  
  (`go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest`)

---

### Environment Variables

Before starting, set the following environment variables (or use a `.env` file):

```env
JWT_SECRET=your-super-long-256-bit-secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dietappdb
```

## 🏃‍♂️ Running the Backend Locally

**Start the PostgreSQL database:**
```sh
docker compose up -d
```
This will initialize or update the database schema to the latest version.

## Apply database migrations:

```sh
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" up
```

## 🔒 Authentication

User credentials are now stored with Argon2 hashed passwords. Demo accounts are:

- `dietista1` / `password123`
- `dietista2` / `password456`

## 🩺 Health Check

To verify the service is running, call:

```sh
curl http://localhost:8080/healthz
```

This will initialize or update the database schema to the latest version.

## Run the Go backend:

Make sure the `JWT_SECRET` environment variable is set before starting the server.

```sh
go run cmd/main.go
```

## 🛠️ Development Tips
- Keep your migration files under version control in db/migrations.
- Never change the database schema directly in production—always use migrations!
- To rollback the last migration:
- 
```sh
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" down 1
```

## 📚 Useful Commands

- Start/stop database with Docker Compose:

```shsh
docker compose up -d    # Start
docker compose down     # Stop
```

- Create a new migration:

```sh
migrate create -ext sql -dir db/migrations -seq create_patients_table
```

- Apply migrations:

```sh
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" up
```
