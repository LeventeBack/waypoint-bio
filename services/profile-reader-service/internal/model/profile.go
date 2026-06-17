package model

// Profile mirrors the public profile payload returned by profile-service
// (passwordHash is never included in that response).
type Profile struct {
	ID          string  `json:"id"`
	Username    string  `json:"username"`
	DisplayName *string `json:"displayName"`
	Bio         *string `json:"bio"`
	Theme       string  `json:"theme"`
	AvatarURL   *string `json:"avatarUrl"`
	CreatedAt   string  `json:"createdAt"`
	UpdatedAt   string  `json:"updatedAt"`
	Links       []Link  `json:"links"`
}

type Link struct {
	ID        string  `json:"id"`
	Title     string  `json:"title"`
	URL       string  `json:"url"`
	IconURL   *string `json:"iconUrl"`
	Order     int     `json:"order"`
	ProfileID string  `json:"profileId"`
}
