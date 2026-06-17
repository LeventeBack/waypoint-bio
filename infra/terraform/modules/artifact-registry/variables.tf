variable "region" {
  description = "Region (Artifact Registry location)."
  type        = string
}

variable "project_id" {
  description = "GCP project ID (used to build the registry URL)."
  type        = string
}

variable "repository_id" {
  description = "Artifact Registry repository name."
  type        = string
  default     = "waypoint"
}

variable "deployer_sa_id" {
  description = "Account ID for the CI/CD deployer service account."
  type        = string
  default     = "waypoint-deployer"
}
