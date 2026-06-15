# ---- Build stage ----
FROM golang:1.22-alpine AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" \
    -o /profile-reader ./cmd/server

# ---- Runtime stage ----
# alpine instead of scratch: curl is needed for the compose healthcheck
FROM alpine:3.19 AS runtime
RUN apk add --no-cache curl ca-certificates

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /profile-reader /usr/local/bin/profile-reader

EXPOSE 3020
CMD ["profile-reader"]
