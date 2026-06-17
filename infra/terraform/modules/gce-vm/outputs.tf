output "agent_public_ip" {
  description = "Public (temporary) IP of the k3s agent node."
  value       = google_compute_instance.agent.network_interface[0].access_config[0].nat_ip
}
