output "subnet_id" {
  description = "Self-link of the node subnet."
  value       = google_compute_subnetwork.nodes.id
}

output "static_ip_address" {
  description = "Reserved external IP for the k3s server / Ingress."
  value       = google_compute_address.ingress.address
}
