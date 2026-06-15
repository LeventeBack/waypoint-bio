package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/cache"
	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/client"
	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/handler"
)

type config struct {
	port                string
	redisURL            string
	profileServiceURL   string
	analyticsServiceURL string
	cacheTTL            time.Duration
}

func loadConfig() (config, error) {
	cfg := config{
		port:                envOr("PORT", "3000"),
		redisURL:            os.Getenv("REDIS_URL"),
		profileServiceURL:   os.Getenv("PROFILE_SERVICE_URL"),
		analyticsServiceURL: os.Getenv("ANALYTICS_SERVICE_URL"),
	}
	if cfg.redisURL == "" {
		return cfg, errors.New("REDIS_URL is required")
	}
	if cfg.profileServiceURL == "" {
		return cfg, errors.New("PROFILE_SERVICE_URL is required")
	}
	if cfg.analyticsServiceURL == "" {
		return cfg, errors.New("ANALYTICS_SERVICE_URL is required")
	}

	ttlRaw := envOr("CACHE_TTL_SECONDS", "300")
	ttlSeconds, err := strconv.Atoi(ttlRaw)
	if err != nil || ttlSeconds <= 0 {
		return cfg, fmt.Errorf("CACHE_TTL_SECONDS must be a positive integer, got %q", ttlRaw)
	}
	cfg.cacheTTL = time.Duration(ttlSeconds) * time.Second

	return cfg, nil
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	cfg, err := loadConfig()
	if err != nil {
		slog.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	redisOpts, err := redis.ParseURL(cfg.redisURL)
	if err != nil {
		slog.Error("invalid REDIS_URL", "error", err)
		os.Exit(1)
	}
	redisClient := redis.NewClient(redisOpts)
	defer redisClient.Close()

	profileCache := cache.New(redisClient, cfg.cacheTTL)
	profileClient := client.NewProfileClient(cfg.profileServiceURL)
	analyticsClient := client.NewAnalyticsClient(cfg.analyticsServiceURL)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handler.Health)
	mux.Handle("DELETE /cache/{username}", &handler.CacheHandler{Cache: profileCache})
	mux.Handle("GET /{username}", &handler.ProfileHandler{
		Cache:     profileCache,
		Profiles:  profileClient,
		Analytics: analyticsClient,
	})

	server := &http.Server{
		Addr:              ":" + cfg.port,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		slog.Info("profile-reader-service listening",
			"port", cfg.port,
			"cacheTTL", cfg.cacheTTL.String(),
			"profileServiceURL", cfg.profileServiceURL,
			"analyticsServiceURL", cfg.analyticsServiceURL,
		)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	slog.Info("shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		slog.Error("graceful shutdown failed", "error", err)
	}
}
