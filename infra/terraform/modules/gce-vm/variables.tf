variable "zone" {
  description = "Zone for both VM instances."
  type        = string
}

variable "machine_type" {
  description = "Machine type for both VMs."
  type        = string
}

variable "image" {
  description = "Boot image for the VMs."
  type        = string
  default     = "ubuntu-os-cloud/ubuntu-2204-lts"
}

variable "disk_size_gb" {
  description = "Boot disk size in GB."
  type        = number
  default     = 20
}

variable "subnet_id" {
  description = "Self-link of the subnet to attach the VMs to."
  type        = string
}

variable "server_static_ip" {
  description = "Reserved external IP to assign to the k3s server node."
  type        = string
}

variable "node_sa_email" {
  description = "Service account email attached to the VMs (registry read access)."
  type        = string
}

variable "ssh_user" {
  description = "Linux username for SSH."
  type        = string
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key file."
  type        = string
}
