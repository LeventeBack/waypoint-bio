output "repository_url" {
  description = "Registry host/path: tag images as <url>/<service>:<tag>."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker.repository_id}"
}

output "deployer_sa_email" {
  description = "Email of the CI/CD deployer service account."
  value       = google_service_account.deployer.email
}

output "deployer_sa_key_base64" {
  description = "Base64-encoded JSON key for the deployer service account."
  value       = google_service_account_key.deployer_key.private_key
  sensitive   = true
}
