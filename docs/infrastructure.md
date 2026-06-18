# Infrastructure

Everything runs on Google Cloud. The cloud resources are managed by Terraform
(`infra/terraform/`). Kubernetes itself is k3s installed on two VMs.

## What runs where

- **Two `e2-medium` VMs** (Ubuntu 22.04): one k3s server, one k3s agent. k3s is
  used for its small footprint.
- A **static IP** fronts the cluster. Traefik (bundled with k3s) serves ingress.

## What Terraform manages

| Module | Resources |
| --- | --- |
| `vpc` | VPC network, subnet, firewall rules, reserved static IP |
| `gce-vm` | the two GCE VM instances (k3s server + agent) |
| `artifact-registry` | Docker image repository + CI/CD service account |
| `gcs-bucket` | image bucket + uploader service account + IAM bindings |

The root module also enables the required Google APIs. Firewall rules open
`80/443` to the internet, `22` and `6443` to admin/CI ranges only.

```bash
cd infra/terraform
terraform output          # static IP, registry URL, service-account email
terraform state list      # everything under Terraform management
```

## File storage (GCS)

Avatars and link icons are uploaded to a Cloud Storage bucket. The bucket, its
uploader service account, and its IAM (including public read) are all defined in
the `gcs-bucket` module. Public read is a variable, so access can be flipped from
Terraform:

```bash
# take the bucket private: images stop loading on public pages (HTTP 403)
terraform apply -var="public_read=false"

# restore public read
terraform apply -var="public_read=true"
```

Verify from the Console (Cloud Storage shows "Public access: Not public" when
private) or directly:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://storage.googleapis.com/waypoint-bio-images/<some-object>   # 200 public, 403 private
gcloud storage buckets describe gs://waypoint-bio-images --format="yaml(labels)"  # managed-by: terraform
```

## Reproduce from scratch

No credentials are committed. You supply your own. The repo ships
`*.example` templates and generates cluster secrets at setup.

1. **Prerequisites:** `gcloud`, `terraform`, `kubectl`, and a GCP project with
   billing enabled. Authenticate: `gcloud auth application-default login`.
2. **State bucket** (Terraform can't create the bucket that holds its own state):
   ```bash
   gcloud storage buckets create gs://<your-tfstate-bucket> --location=europe-west1
   ```
   Set that name in `infra/terraform/backend.tf`.
3. **Provision the cloud:**
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars   # fill project_id, ssh key path, your IP
   terraform init
   terraform apply
   ```
4. **Install k3s** on the VMs (SSH in): run the k3s server installer on the
   server VM, then join the agent with the server's node token. Copy the
   server's kubeconfig locally and replace `127.0.0.1` with the static IP.
5. **Deploy the app:** follow [kubernetes.md](kubernetes.md): `bootstrap.sh`
   then `kubectl apply`.
6. **Automated deploys** from then on: [ci-cd.md](ci-cd.md).

### Secrets you provide (never in git)

| Where | What |
| --- | --- |
| `infra/terraform/terraform.tfvars` | project id, SSH key path, admin IP |
| `secrets/waypoint-storage-key.json` | GCS uploader service-account key |
| GitHub Actions secrets | `GCP_SA_KEY`, `KUBECONFIG` (see ci-cd.md) |
| generated at setup | database passwords + JWT secret (by `bootstrap.sh`) |
