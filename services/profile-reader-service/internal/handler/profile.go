package handler

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net"
	"net/http"
	"strings"

	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/cache"
	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/client"
)

// ProfileHandler serves GET /{username}: Redis first, profile-service on a miss.
type ProfileHandler struct {
	Cache     *cache.Cache
	Profiles  *client.ProfileClient
	Analytics *client.AnalyticsClient
}

func (h *ProfileHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")
	ctx := r.Context()

	cached, found, err := h.Cache.Get(ctx, username)
	if err != nil {
		slog.Warn("redis unavailable, falling back to profile-service", "username", username, "error", err)
	}
	if found {
		slog.Info("cache hit", "username", username)
		w.Header().Set("X-Cache", "HIT")
		writeRawJSON(w, http.StatusOK, cached)
		return
	}

	profile, err := h.Profiles.GetByUsername(ctx, username)
	if errors.Is(err, client.ErrProfileNotFound) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "profile not found"})
		return
	}
	if err != nil {
		slog.Error("profile-service lookup failed", "username", username, "error", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "profile service unavailable"})
		return
	}

	body, err := json.Marshal(profile)
	if err != nil {
		slog.Error("marshal profile failed", "username", username, "error", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal error"})
		return
	}

	if err := h.Cache.Set(ctx, username, body); err != nil {
		slog.Warn("failed to cache profile", "username", username, "error", err)
	}

	// Best-effort view event; must never block or affect the response.
	go h.Analytics.TrackView(username, clientIP(r))

	slog.Info("cache miss", "username", username)
	w.Header().Set("X-Cache", "MISS")
	writeRawJSON(w, http.StatusOK, body)
}

// clientIP prefers the first X-Forwarded-For hop, falling back to RemoteAddr.
func clientIP(r *http.Request) string {
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		return strings.TrimSpace(strings.Split(fwd, ",")[0])
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	body, err := json.Marshal(payload)
	if err != nil {
		slog.Error("marshal response failed", "error", err)
		http.Error(w, `{"error":"internal error"}`, http.StatusInternalServerError)
		return
	}
	writeRawJSON(w, status, body)
}

func writeRawJSON(w http.ResponseWriter, status int, body []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if _, err := w.Write(body); err != nil {
		slog.Warn("write response failed", "error", err)
	}
}
