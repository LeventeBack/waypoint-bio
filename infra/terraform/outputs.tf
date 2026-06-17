output "server_public_ip" {
  description = "Static public IP of the k3s server node. Point kubectl and Ingress here."
  value       = module.vpc.static_ip_address
}

output "agent_public_ip" {
  description = "Temporary public IP of the k3s agent node (for SSH / joining the cluster)."
  value       = module.gce_vm.agent_public_ip
}

output "artifact_registry_url" {
  description = "Docker registry host/path. Tag images as <url>/<service>:<tag>."
  value       = module.artifact_registry.repository_url
}

output "deployer_sa_email" {
  description = "Service account used by CI to push images (and as the k8s image-pull secret)."
  value       = module.artifact_registry.deployer_sa_email
}

# Private key is stored in Terraform state; treat the state bucket as sensitive.
output "deployer_sa_key_base64" {
  description = "Base64-encoded JSON key for the deployer service account."
  value       = module.artifact_registry.deployer_sa_key_base64
  sensitive   = true
}
