#!/usr/bin/env bash
# Build all service images for linux/amd64 and push them to Artifact Registry. 
# Used to seed the registry for the first manual deploy;
# GitHub Actions does the same on every push to main.
#
# Prerequisites: 
#   - Docker running
#   - buildx available
#   - registry auth:
#     gcloud auth configure-docker europe-west1-docker.pkg.dev
#
# Usage:  
#   ./infra/build-push.sh [TAG]   (TAG defaults to "latest")

set -euo pipefail

REG="europe-west1-docker.pkg.dev/waypoint-bio-project/waypoint"
TAG="${1:-latest}"
PLATFORM="linux/amd64"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

build() { # <image-name> <context> <target?>
  local name="$1" ctx="$2" target="${3:-}"
  echo ">>> $REG/$name:$TAG"
  docker buildx build --platform "$PLATFORM" \
    ${target:+--target "$target"} \
    -t "$REG/$name:$TAG" "$ROOT/$ctx" --push
}

build profile-service          services/profile-service        runtime
build profile-service-migrate  services/profile-service        migrator
build profile-reader-service   services/profile-reader-service
build analytics-service        services/analytics-service      runtime
build frontend                 services/frontend               runtime

echo "All images pushed with tag: $TAG"
