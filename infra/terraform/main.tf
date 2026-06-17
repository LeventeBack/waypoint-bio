terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "storage.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

module "vpc" {
  source                = "./modules/vpc"
  region                = var.region
  admin_source_ranges   = var.admin_source_ranges
  k3s_api_source_ranges = var.k3s_api_source_ranges

  depends_on = [google_project_service.apis]
}

module "artifact_registry" {
  source     = "./modules/artifact-registry"
  region     = var.region
  project_id = var.project_id

  depends_on = [google_project_service.apis]
}

module "gcs_bucket" {
  source = "./modules/gcs-bucket"

  public_read = var.public_read

  depends_on = [google_project_service.apis]
}

module "gce_vm" {
  source = "./modules/gce-vm"

  zone                = var.zone
  machine_type        = var.machine_type
  subnet_id           = module.vpc.subnet_id
  server_static_ip    = module.vpc.static_ip_address
  node_sa_email       = module.artifact_registry.deployer_sa_email
  ssh_user            = var.ssh_user
  ssh_public_key_path = var.ssh_public_key_path

  depends_on = [google_project_service.apis]
}
