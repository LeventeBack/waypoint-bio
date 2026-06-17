resource "google_artifact_registry_repository" "docker" {
  location      = var.region
  repository_id = var.repository_id
  description   = "Docker images for the Waypoint Bio microservices"
  format        = "DOCKER"
}

# Service account used by GitHub Actions to push images, and reused as the
# Kubernetes image-pull secret so the nodes can pull from this registry.
resource "google_service_account" "deployer" {
  account_id   = var.deployer_sa_id
  display_name = "Waypoint CI/CD deployer"
}

# Writer implies reader, so this one binding covers both push (CI) and pull (k8s).
resource "google_artifact_registry_repository_iam_member" "deployer_writer" {
  location   = google_artifact_registry_repository.docker.location
  repository = google_artifact_registry_repository.docker.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.deployer.email}"
}

# Key material lives in Terraform state; keep the state bucket locked down.
resource "google_service_account_key" "deployer_key" {
  service_account_id = google_service_account.deployer.name
}
