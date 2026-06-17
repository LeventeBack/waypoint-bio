resource "google_compute_network" "vpc" {
  name                    = var.network_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "nodes" {
  name          = "${var.network_name}-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Reserved external IP for the server node (Ingress entrypoint).
resource "google_compute_address" "ingress" {
  name   = "${var.network_name}-ingress-ip"
  region = var.region
}

# --- Firewall rules (all scoped to the "k3s" network tag on the VMs) ---

# Public web traffic to Traefik.
resource "google_compute_firewall" "web" {
  name      = "${var.network_name}-allow-web"
  network   = google_compute_network.vpc.name
  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["k3s"]
}

# SSH (admin source ranges only).
resource "google_compute_firewall" "ssh" {
  name      = "${var.network_name}-allow-ssh"
  network   = google_compute_network.vpc.name
  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = var.admin_source_ranges
  target_tags   = ["k3s"]
}

# Remote kubectl + CI/CD access to the k3s API server (6443) - only on the server node.
resource "google_compute_firewall" "k3s_api" {
  name      = "${var.network_name}-allow-k3s-api"
  network   = google_compute_network.vpc.name
  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["6443"]
  }

  source_ranges = var.k3s_api_source_ranges
  target_tags   = ["k3s-server"]
}

# Intra-cluster node-to-node traffic (flannel, kubelet, API).
resource "google_compute_firewall" "internal" {
  name      = "${var.network_name}-allow-internal"
  network   = google_compute_network.vpc.name
  direction = "INGRESS"

  allow { protocol = "tcp" }
  allow { protocol = "udp" }
  allow { protocol = "icmp" }

  source_ranges = [var.subnet_cidr]
  target_tags   = ["k3s"]
}
