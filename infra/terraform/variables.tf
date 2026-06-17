variable "project_id" {
  description = "GCP project ID to deploy into."
  type        = string
}

variable "region" {
  description = "GCP region for the subnet, static IP, and Artifact Registry."
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "GCP zone for the two GCE VMs."
  type        = string
  default     = "europe-west1-b"
}

variable "machine_type" {
  description = "Machine type for both k3s VMs."
  type        = string
  default     = "e2-medium"
}

variable "ssh_user" {
  description = "Linux username created on the VMs for SSH access."
  type        = string
  default     = "waypoint"
}

variable "ssh_public_key_path" {
  description = "Path to the SSH PUBLIC key added to the VMs' metadata (e.g. ~/.ssh/id_ed25519.pub)."
  type        = string
}

variable "admin_source_ranges" {
  description = "CIDRs allowed to reach SSH (22)."
  type        = list(string)
}

variable "k3s_api_source_ranges" {
  description = "CIDRs allowed to reach the k3s API (6443). Open by default for CI runners; protected by client-cert auth."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "public_read" {
  description = "Grant public read on the image bucket. Set false to take it private."
  type        = bool
  default     = true
}
