package client

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/LeventeBack/waypoint-bio/services/profile-reader-service/internal/model"
)

// ErrProfileNotFound is returned when profile-service answers 404 for a username.
var ErrProfileNotFound = errors.New("profile not found")

const (
	profileTimeout = 3 * time.Second
	profileRetries = 2
	retryBackoff   = 200 * time.Millisecond
)

// ProfileClient calls profile-service over HTTP.
type ProfileClient struct {
	baseURL string
	http    *http.Client
}

func NewProfileClient(baseURL string) *ProfileClient {
	return &ProfileClient{
		baseURL: strings.TrimRight(baseURL, "/"),
		http:    &http.Client{Timeout: profileTimeout},
	}
}

// GetByUsername fetches the public profile from profile-service, retrying
// transient failures (network errors and 5xx responses). 404 and other
// client errors are returned immediately.
func (c *ProfileClient) GetByUsername(ctx context.Context, username string) (*model.Profile, error) {
	endpoint := fmt.Sprintf("%s/profiles/%s", c.baseURL, url.PathEscape(username))

	var lastErr error
	for attempt := 0; attempt <= profileRetries; attempt++ {
		if attempt > 0 {
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(retryBackoff):
			}
		}

		profile, retryable, err := c.fetch(ctx, endpoint)
		if err == nil {
			return profile, nil
		}
		if !retryable {
			return nil, err
		}
		lastErr = err
	}
	return nil, lastErr
}

func (c *ProfileClient) fetch(ctx context.Context, endpoint string) (profile *model.Profile, retryable bool, err error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, false, err
	}

	res, err := c.http.Do(req)
	if err != nil {
		return nil, true, fmt.Errorf("profile-service request failed: %w", err)
	}
	defer res.Body.Close()

	switch {
	case res.StatusCode == http.StatusOK:
		var p model.Profile
		if err := json.NewDecoder(res.Body).Decode(&p); err != nil {
			return nil, false, fmt.Errorf("decode profile response: %w", err)
		}
		return &p, false, nil
	case res.StatusCode == http.StatusNotFound:
		return nil, false, ErrProfileNotFound
	case res.StatusCode >= 500:
		return nil, true, fmt.Errorf("profile-service returned %d", res.StatusCode)
	default:
		return nil, false, fmt.Errorf("profile-service returned %d", res.StatusCode)
	}
}
