variable "bucket_name" {
  description = "Name of the public image bucket."
  type        = string
  default     = "waypoint-bio-images"
}

variable "location" {
  description = "Bucket location. Immutable - must match the existing bucket."
  type        = string
  default     = "EUROPE-WEST4"
}

variable "storage_sa_id" {
  description = "Account ID for the storage uploader service account."
  type        = string
  default     = "waypoint-storage"
}

variable "public_read" {
  description = "Grant allUsers read so profile images are publicly viewable. Set false to make the bucket private."
  type        = bool
  default     = true
}
