# Kubernetes

The cluster is k3s on two GCE VMs (see [infrastructure.md](infrastructure.md)).
All workloads live in the `waypoint` namespace. Manifests are under `infra/k8s/`,
grouped per service with one resource per file.

```
infra/k8s/
  namespace.yaml   configmap.yaml   bootstrap.sh
  profile-service/         deployment.yaml service.yaml ingress.yaml postgres.yaml migrate-job.yaml
  profile-reader-service/  deployment.yaml service.yaml hpa.yaml redis.yaml
  analytics-service/       deployment.yaml service.yaml mongo.yaml
  frontend/                deployment.yaml service.yaml ingress.yaml
```

Every service ships a Docker image and a Deployment + Service. Databases run
in-cluster as StatefulSets (Postgres, Mongo) or a Deployment (Redis).

## Configuration

Non-secret, shared config lives in a ConfigMap. Values used by a single service
live inline in that Deployment. Secrets are never committed. They are generated
at first setup by `bootstrap.sh` and created with `kubectl`.

```bash
kubectl get configmap waypoint-shared-config -n waypoint -o yaml   # in-cluster service URLs
kubectl get secret -n waypoint
#   waypoint-secrets        JWT + database credentials
#   waypoint-storage-key    GCS uploader key (mounted into profile-service)
#   regcred                 Artifact Registry pull credentials
```

## Routing and ingress

Two ingresses expose the public surface through k3s's built-in Traefik. Hosts use
[nip.io](https://nip.io), which maps `<anything>.34.52.151.85.nip.io` to the
cluster's static IP, so no domain is required.

| Ingress | Host | Backend |
| --- | --- | --- |
| `waypoint-frontend` | app.34.52.151.85.nip.io | frontend |
| `waypoint-api` | api.34.52.151.85.nip.io | profile-service |

`profile-reader-service` and `analytics-service` have no ingress. They are
ClusterIP only and reachable solely from inside the cluster.

```bash
kubectl get ingress -n waypoint
kubectl describe ingress waypoint-frontend -n waypoint

# from the internet, the two public hosts respond
curl -sI http://app.34.52.151.85.nip.io/ | head -1     # 200 / 307
curl -s  http://api.34.52.151.85.nip.io/health         # {"status":"ok","db":"up"}

# internal services are NOT reachable from outside (times out)
curl -m 5 http://34.52.151.85:3030/health ; echo "exit=$?"   # analytics -> exit=28

# but they answer from inside the cluster
kubectl exec -n waypoint deploy/profile-reader-service -- \
  curl -s http://analytics-service:3030/health
```

## Scaling

`profile-reader-service` (the read hot path) has a HorizontalPodAutoscaler:
2 to 6 replicas, target 60% CPU. metrics-server ships with k3s.

```bash
kubectl get hpa -n waypoint
# NAME                     TARGETS       MINPODS  MAXPODS  REPLICAS
# profile-reader-service   cpu: 1%/60%   2        6        2
```

## Deploy to the cluster

First time, with `KUBECONFIG` pointed at the cluster:

```bash
export KUBECONFIG=~/.kube/waypoint.yaml

./infra/k8s/bootstrap.sh                          # namespace + secrets + pull cred (idempotent)
kubectl apply -f infra/k8s/configmap.yaml
kubectl apply -f infra/k8s/profile-service/        # includes the migration Job
kubectl apply -f infra/k8s/profile-reader-service/
kubectl apply -f infra/k8s/analytics-service/
kubectl apply -f infra/k8s/frontend/
```

Image updates after that are automated. See [ci-cd.md](ci-cd.md).

## Verify

```bash
kubectl get pods,svc,ingress,hpa -n waypoint     # everything in one view
kubectl rollout status deployment/frontend -n waypoint
kubectl logs deploy/profile-service -n waypoint
kubectl logs job/profile-migrate -n waypoint     # migration output
```
