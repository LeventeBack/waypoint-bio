#!/usr/bin/env bash
# First-time cluster setup: namespace, app secrets, and the Artifact Registry
# image-pull secret. Run once after the cluster is up. Passwords are generated
# at runtime - nothing sensitive is stored in this file or in git.
#
# Prerequisites: 
#   - kubectl pointed at the cluster
#   - `terraform apply` already run
# 
# Usage: 
#   ./infra/k8s/bootstrap.sh

set -euo pipefail

NS="waypoint"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REGISTRY_HOST="europe-west1-docker.pkg.dev"
DEPLOYER_SA="waypoint-deployer@waypoint-bio-project.iam.gserviceaccount.com"

kubectl get namespace "$NS" >/dev/null 2>&1 || kubectl create namespace "$NS"

# --- app secrets (the password baked into each *_DB_URL matches its standalone
# password var, which is why they're generated together) ---
if kubectl get secret waypoint-secrets -n "$NS" >/dev/null 2>&1; then
  echo "waypoint-secrets exists, leaving it untouched"
else
  db_pw="$(openssl rand -hex 16)"
  mongo_pw="$(openssl rand -hex 16)"
  kubectl create secret generic waypoint-secrets -n "$NS" \
    --from-literal=JWT_SECRET="$(openssl rand -hex 32)" \
    --from-literal=POSTGRES_USER=waypoint \
    --from-literal=POSTGRES_PASSWORD="$db_pw" \
    --from-literal=POSTGRES_DB=waypoint_profiles \
    --from-literal=PROFILE_DB_URL="postgresql://waypoint:${db_pw}@postgres-profile:5432/waypoint_profiles" \
    --from-literal=MONGO_INITDB_ROOT_USERNAME=waypoint \
    --from-literal=MONGO_INITDB_ROOT_PASSWORD="$mongo_pw" \
    --from-literal=MONGO_INITDB_DATABASE=waypoint_analytics \
    --from-literal=ANALYTICS_DB_URL="mongodb://waypoint:${mongo_pw}@mongo-analytics:27017/waypoint_analytics?authSource=admin"
  echo "created waypoint-secrets"
fi

# --- GCS storage key (profile-service reads it to upload images) ---
if kubectl get secret waypoint-storage-key -n "$NS" >/dev/null 2>&1; then
  echo "waypoint-storage-key exists, leaving it untouched"
else
  kubectl create secret generic waypoint-storage-key -n "$NS" \
    --from-file=key.json="$ROOT/secrets/waypoint-storage-key.json"
  echo "created waypoint-storage-key"
fi

# --- image-pull secret from the Terraform-managed deployer key ---
if kubectl get secret regcred -n "$NS" >/dev/null 2>&1; then
  echo "regcred exists, leaving it untouched"
else
  key="$(terraform -chdir="$ROOT/infra/terraform" output -raw deployer_sa_key_base64 | base64 --decode)"
  kubectl create secret docker-registry regcred -n "$NS" \
    --docker-server="$REGISTRY_HOST" \
    --docker-username=_json_key \
    --docker-password="$key" \
    --docker-email="$DEPLOYER_SA"
  echo "created regcred"
fi

# default service account pulls from Artifact Registry without per-pod config
kubectl patch serviceaccount default -n "$NS" \
  -p '{"imagePullSecrets":[{"name":"regcred"}]}'

echo "bootstrap complete"
