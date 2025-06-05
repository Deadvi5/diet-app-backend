# Usa una immagine leggera per buildare il binario
FROM golang:1.24-alpine AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia go.mod e go.sum per installare le dipendenze
COPY go.mod go.sum ./

# Installa le dipendenze
RUN go mod download

# Copia il resto del codice sorgente
COPY . .

# Installa la CLI di go-swagger e genera lo spec OpenAPI
RUN go install github.com/go-swagger/go-swagger/cmd/swagger@latest && \
    swagger generate spec -o api/openapi.yaml && \
    go build -o diet-app ./cmd/main.go

# Usa un'immagine minimale per il runtime
FROM alpine:latest

# Imposta directory di lavoro finale
WORKDIR /app

# Copia il binario compilato e lo spec OpenAPI
COPY --from=builder /app/diet-app .
COPY --from=builder /app/api/openapi.yaml ./api/openapi.yaml

# Espone la porta su cui il backend ascolta (es. 8080)
EXPOSE 8080

# Comando di avvio
CMD ["./diet-app"]
