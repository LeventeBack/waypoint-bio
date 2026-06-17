variable "region" {
  description = "Region for the subnet and static IP."
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network."
  type        = string
  default     = "waypoint-vpc"
}

variable "subnet_cidr" {
  description = "CIDR range for the node subnet."
  type        = string
  default     = "10.10.0.0/24"
}

variable "admin_source_ranges" {
  description = "CIDRs allowed to reach SSH (22)."
  type        = list(string)
}

variable "k3s_api_source_ranges" {
  description = "CIDRs allowed to reach the k3s API (6443)."
  type        = list(string)
}
