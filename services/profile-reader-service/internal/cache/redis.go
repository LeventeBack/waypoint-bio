package cache

import (
	"context"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

// Cache wraps the Redis client used to store rendered profile responses.
type Cache struct {
	client *redis.Client
	ttl    time.Duration
}

func New(client *redis.Client, ttl time.Duration) *Cache {
	return &Cache{client: client, ttl: ttl}
}

// Get returns the cached profile JSON for username.
// found is false on a cache miss; err is only set for real Redis failures.
func (c *Cache) Get(ctx context.Context, username string) (data []byte, found bool, err error) {
	val, err := c.client.Get(ctx, key(username)).Bytes()
	if errors.Is(err, redis.Nil) {
		return nil, false, nil
	}
	if err != nil {
		return nil, false, err
	}
	return val, true, nil
}

func (c *Cache) Set(ctx context.Context, username string, data []byte) error {
	return c.client.Set(ctx, key(username), data, c.ttl).Err()
}

func (c *Cache) Delete(ctx context.Context, username string) error {
	return c.client.Del(ctx, key(username)).Err()
}

func key(username string) string {
	return "profile:" + username
}
