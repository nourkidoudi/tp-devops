
## 28. Kubernetes — configuration de l'application

### 147 - ConfigMap

Le ConfigMap `app-config` contient la configuration non sensible du frontend et de l'API (`k8s/configmap.yaml`) :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: devsecops-portfolio
data:
  PORT: "3001"
  SQS_ENDPOINT: "http://192.168.237.130:4566"
  SQS_QUEUE_URL: "http://192.168.237.130:4566/000000000000/portfolio-queue"
  AWS_REGION: "us-east-1"
  NEXT_PUBLIC_API_URL: "http://api-service"
```

```bash
kubectl apply -f k8s/configmap.yaml
kubectl get configmap -n devsecops-portfolio
```

```text
NAME               DATA   AGE
app-config         5      76m
kube-root-ca.crt   1      3h23m
```

### 148 - Secret

Le Secret `app-secret` contient les valeurs sensibles de démonstration (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`). Les valeurs ne sont pas affichées ici.

```bash
kubectl apply -f k8s/secret.yaml
kubectl get secret app-secret -n devsecops-portfolio
```

```text
NAME         TYPE     DATA   AGE
app-secret   Opaque   5      74m
```

### 149 - Deployments utilisant le ConfigMap et le Secret

Les Deployments `api` et `frontend` chargent le ConfigMap `app-config` (`envFrom`) et utilisent le Secret `app-secret` pour les valeurs sensibles.

Point d'attention : `app-config` définit `PORT=3001` pour l'API. Le frontend le chargeait aussi et écoutait sur 3001 au lieu de 3000, ce qui donnait un `502 Bad Gateway` via l'Ingress. Correction : une variable `env` explicite, prioritaire sur `envFrom`, dans le Deployment du frontend. Le frontend utilise aussi `API_URL=http://api-service` pour joindre l'API via le Service interne.

```yaml
env:
  - name: PORT
    value: "3000"
  - name: API_URL
    value: "http://api-service"
```

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl exec deploy/frontend -n devsecops-portfolio -- env | grep -E '^(PORT|API_URL)'
```

```text
API_URL=http://api-service
PORT=3000
```

### 150 - PostgreSQL avec PersistentVolumeClaim

PostgreSQL est déployé dans Kubernetes avec un PVC `postgres-pvc` (`k8s/postgres.yaml`) :

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: devsecops-portfolio
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: devsecops-portfolio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:17-alpine
        ports:
        - containerPort: 5432
        envFrom:
        - secretRef:
            name: app-secret
        securityContext:
          appArmorProfile:
            type: Unconfined
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: devsecops-portfolio
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

```bash
kubectl apply -f k8s/postgres.yaml
kubectl get pvc -n devsecops-portfolio
```

```text
NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
postgres-pvc   Bound    pvc-abe65dbe-2c55-490d-9ad1-f5b5201a6a89   1Gi        RWO            local-path     <unset>                 62m
```

Test de persistance : création d'une table, suppression du Pod, puis vérification que les données existent toujours dans le nouveau Pod.

```bash
kubectl exec deploy/postgres -n devsecops-portfolio -- sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE TABLE IF NOT EXISTS test_pvc(id int); INSERT INTO test_pvc VALUES (1);"'
kubectl delete pod -l app=postgres -n devsecops-portfolio
kubectl get pods -n devsecops-portfolio -w
kubectl exec deploy/postgres -n devsecops-portfolio -- sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM test_pvc;"'
```

Les données survivent à la suppression du Pod, car elles sont stockées sur le volume persistant (StorageClass `local-path`).

https://screenshots/150-pvc-postgres.png

### 151 et 152 - Ingress `portfolio.local` et `portfolio.local/api`

Traefik (Ingress Controller par défaut de K3s) expose le frontend sur `portfolio.local` et l'API sur `portfolio.local/api`. Les routes de l'API commencent déjà par `/api`, donc le préfixe n'est pas retiré. Sur la machine physique, le fichier `hosts` contient `192.168.237.130  portfolio.local`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  namespace: devsecops-portfolio
spec:
  ingressClassName: traefik
  rules:
    - host: portfolio.local
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

```bash
kubectl apply -f k8s/ingress.yaml
kubectl get ingress -n devsecops-portfolio
```

```text
NAME                CLASS     HOSTS             ADDRESS           PORTS   AGE
portfolio-ingress   traefik   portfolio.local   192.168.237.130   80      21m
```

Portfolio accessible depuis la machine physique :

https://screenshots/151-ingress-portfolio.png

https://screenshots/152-portfolio-api.png
