package handler

import "net/http"

// Health reports liveness only — no dependency checks, always 200.
func Health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
