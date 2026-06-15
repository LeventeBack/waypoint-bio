package client

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

const analyticsTimeout = 1 * time.Second

// AnalyticsClient sends best-effort profile view events to analytics-service.
// It is fire-and-forget only: failures are logged, never propagated, so it
// can never affect an HTTP response.
type AnalyticsClient struct {
	baseURL string
	http    *http.Client
}

func NewAnalyticsClient(baseURL string) *AnalyticsClient {
	return &AnalyticsClient{
		baseURL: strings.TrimRight(baseURL, "/"),
		http:    &http.Client{Timeout: analyticsTimeout},
	}
}

type viewEvent struct {
	Username  string `json:"username"`
	Timestamp string `json:"timestamp"`
	IP        string `json:"ip"`
}

// TrackView posts a profile view event to analytics-service. Callers are
// expected to run it in its own goroutine; it deliberately uses a fresh
// context so it outlives the originating request.
func (c *AnalyticsClient) TrackView(username, ip string) {
	event := viewEvent{
		Username:  username,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		IP:        ip,
	}

	body, err := json.Marshal(event)
	if err != nil {
		slog.Warn("analytics: marshal event failed", "error", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), analyticsTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/events", bytes.NewReader(body))
	if err != nil {
		slog.Warn("analytics: build request failed", "error", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := c.http.Do(req)
	if err != nil {
		slog.Warn("analytics: event delivery failed", "username", username, "error", err)
		return
	}
	defer res.Body.Close()
	_, _ = io.Copy(io.Discard, res.Body) // drain so the connection can be reused

	if res.StatusCode >= 300 {
		slog.Warn("analytics: event rejected", "username", username, "status", res.StatusCode)
	}
}
