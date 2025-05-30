# 🥗 DietApp Backend

This project is the backend service for a multi-tenant dietitian app, written in Go, using Gin as the web framework and PostgreSQL as the database.

## 🚀 Quick Start

### **Prerequisites**
- [Go](https://golang.org/) 1.24 or higher
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [`golang-migrate`](https://github.com/golang-migrate/migrate) installed (`go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest`)

---

### **Environment Variables**

Before starting, set the following environment variables (or use a `.env` file):

```env
JWT_SECRET=your-super-long-256-bit-secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dietappdb


# Running the Backend Locally
Start the PostgreSQL database:

sh
Copy
Edit
docker compose up -d
Apply database migrations:

sh
Copy
Edit
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" up
This will initialize or update the database schema to the latest version.

Run the Go backend:

sh
Copy
Edit
go run cmd/main.go
The backend server will be available at http://localhost:8080

🛠️ Development Tips
Keep your migration files under version control in db/migrations.

Never change the database schema directly in production—always use migrations!

To rollback the last migration:

sh
Copy
Edit
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" down 1
📚 Useful Commands
Start/stop database with Docker Compose:

sh
Copy
Edit
docker compose up -d    # Start
docker compose down     # Stop
Create a new migration:

sh
Copy
Edit
migrate create -ext sql -dir db/migrations -seq create_patients_table
Apply migrations:

sh
Copy
Edit
migrate -path db/migrations -database "postgres://postgres:postgres@localhost:5432/dietappdb?sslmode=disable" up
📝 License
MIT

❤️ Contributing
Open an issue or submit a pull request to improve this project!

yaml
Copy
Edit

---

Let me know if you want to add sections for **API usage**, **architecture**, or any extra details!







