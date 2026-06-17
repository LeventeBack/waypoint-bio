locals {
  # GCE injects SSH keys via metadata in the form "USERNAME:PUBLIC_KEY".
  ssh_metadata = "${var.ssh_user}:${trimspace(file(pathexpand(var.ssh_public_key_path)))}"
}

# --- k3s SERVER (control plane) ---
# Gets the reserved static IP. Tagged "k3s-server" so only this node exposes 6443.
resource "google_compute_instance" "server" {
  name         = "waypoint-k3s-server"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["k3s", "k3s-server"]

  boot_disk {
    initialize_params {
      image = var.image
      size  = var.disk_size_gb
    }
  }

  network_interface {
    subnetwork = var.subnet_id
    access_config {
      nat_ip = var.server_static_ip
    }
  }

  metadata = {
    ssh-keys = local.ssh_metadata
  }

  service_account {
    email  = var.node_sa_email
    scopes = ["cloud-platform"]
  }
}

# --- k3s AGENT (worker) ---
# Worker node - temporary public IP for SSH
resource "google_compute_instance" "agent" {
  name         = "waypoint-k3s-agent"
  machine_type = var.machine_type
  zone         = var.zone
  tags         = ["k3s"]

  boot_disk {
    initialize_params {
      image = var.image
      size  = var.disk_size_gb
    }
  }

  network_interface {
    subnetwork = var.subnet_id
    access_config {} # temporary external IP
  }

  metadata = {
    ssh-keys = local.ssh_metadata
  }

  service_account {
    email  = var.node_sa_email
    scopes = ["cloud-platform"]
  }
}
