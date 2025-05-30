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

# Compila l'applicazione
RUN go build -o diet-app ./cmd/main.go

# Usa un'immagine minimale per il runtime
FROM alpine:latest

# Imposta directory di lavoro finale
WORKDIR /app

# Copia solo il binario compilato
COPY --from=builder /app/diet-app .

# Espone la porta su cui il backend ascolta (es. 8080)
EXPOSE 8080

# Comando di avvio
CMD ["./diet-app"]
