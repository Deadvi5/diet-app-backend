FROM golang:1.24

RUN go install github.com/go-delve/delve/cmd/dlv@latest

WORKDIR /app

COPY backend ./backend

WORKDIR /app/backend
RUN go mod download
RUN go build -gcflags="all=-N -l" -o /app/diet-app ./cmd/main.go

WORKDIR /app
EXPOSE 40000

CMD ["dlv", "exec", "/app/diet-app", "--headless", "--listen=:40000", "--api-version=2", "--accept-multiclient"]
