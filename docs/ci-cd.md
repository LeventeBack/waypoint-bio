# CI/CD

One GitHub Actions workflow (`.github/workflows/ci-cd.yaml`) handles both
validation and deployment.

## What runs

| Job | Trigger | Does |
| --- | --- | --- |
| `node` | PR + push to main | lint, type-check, build the TS services |
| `go` | PR + push to main | build, vet, lint the Go reader |
| `docker` | PR + push to main | `docker build` each service (no push) |
| `deploy` | push to main only | build & push images, then roll them out |

`deploy` runs only after the three checks pass (`needs:`), and only on a push to
`main`. Pull requests run the checks but never deploy.

## What deploy does

1. Authenticate to Google Cloud and configure Docker for Artifact Registry.
2. Build and push every service image, tagged with the commit SHA (and `latest`).
3. `kubectl apply` the shared ConfigMap.
4. Run the database migration Job and wait for it to complete.
5. `kubectl set image` each Deployment to the new SHA, then wait for rollout.

App secrets (database passwords, JWT) never pass through CI. They live only in
the cluster. CI only needs cloud and cluster access.

## Required repository secrets

| Secret | Purpose |
| --- | --- |
| `GCP_SA_KEY` | service-account key to push images to Artifact Registry |
| `KUBECONFIG` | base64 kubeconfig for `kubectl` against the cluster |

Set them (run from the repo root, `gh` authenticated):

```bash
terraform -chdir=infra/terraform output -raw deployer_sa_key_base64 \
  | base64 --decode | gh secret set GCP_SA_KEY

base64 -i ~/.kube/waypoint.yaml | gh secret set KUBECONFIG
```

## Trigger and watch

```bash
git push origin main
gh run watch          # follow the run live
```

A merge/push to `main` is all it takes to ship a new version to the cluster.

> One-time setup before the first automated deploy: the cluster must already be
> bootstrapped (secrets + manifests applied per [kubernetes.md](kubernetes.md)).
> CD updates images on existing Deployments. It does not create the cluster.
