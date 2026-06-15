package handler

import (
	"log/slog"
	"net/http"

	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/cache"
)

// CacheHandler serves DELETE /cache/{username}, called by profile-service
// after any profile or link write to invalidate the cached page.
type CacheHandler struct {
	Cache *cache.Cache
}

func (h *CacheHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")

	if err := h.Cache.Delete(r.Context(), username); err != nil {
		slog.Error("cache invalidation failed", "username", username, "error", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "cache invalidation failed"})
		return
	}

	slog.Info("cache invalidated", "username", username)
	w.WriteHeader(http.StatusNoContent)
}
