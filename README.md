## 17. GitHub Actions et sécurité GitHub

Le workflow `.github/workflows/ci.yml` implémente une chaîne CI DevSecOps complète.

### 70 - Workflow GitHub Actions : tests frontend et API

Le workflow se déclenche à chaque `push` et `pull_request` sur la branche `main`. Il utilise des environnements Node.js isolés pour garantir la reproductibilité.

### 71 - Secrets, SAST et contrôle des dépendances dans le workflow

Le pipeline intègre trois contrôles de sécurité essentiels :
- **Gitleaks** : scan de tout l'historique Git à la recherche de secrets.
- **Semgrep** : analyse statique (SAST) du code Express et Next.js.
- **npm audit** : vérification des vulnérabilités dans les dépendances Node.js.

### 72 - Construction des deux images Docker dans le workflow

Les images `devsecops-api` et `devsecops-portfolio` sont construites automatiquement avec le tag correspondant au Git SHA du commit.

### 73 - Scan des images avec Trivy

Chaque image construite est immédiatement scannée par **Trivy**. Le pipeline échoue si une vulnérabilité de sévérité `CRITICAL` est détectée.

### 74 - CodeQL (GitHub Advanced Security) et comparaison avec Semgrep

Le workflow `.github/workflows/codeql.yml` active **CodeQL**, le moteur SAST intégré à GitHub.

| Alerte | Semgrep | CodeQL | Fichier | Sévérité | Décision |
|---|---|---|---|---|---|
| Absence de middleware CSRF | ✅ détecté | **0 alerte** | `api/server.js` | Warning | Neutralisé par `// nosemgrep` |
| Autres alertes de sécurité | ✅ 0 trouvé | **0 alerte** | — | — | — |

### 75 - Dependabot : dépendances vulnérables et PR automatiques

Le fichier `.github/dependabot.yml` surveille chaque semaine les dépendances et ouvre automatiquement des Pull Requests de mise à jour.

![Pull Request générée automatiquement par Dependabot](screenshots/75-dependabot-pr.png)

### 76 - Permissions minimales du GITHUB_TOKEN

Le bloc `permissions:` limite le token GITHUB_TOKEN au strict nécessaire (lecture seule pour la CI, écriture des releases pour semantic-release).

### 77 - Actions tierces épinglées par SHA

Toutes les actions utilisées dans les workflows sont épinglées par leur **SHA de commit** (immuable) plutôt que par un tag de version, afin de se protéger contre les attaques de la chaîne d'approvisionnement (Supply Chain Attacks).

### 78 - Comparaison GitHub Actions / Jenkins

| Caractéristique | Jenkins | GitHub Actions |
|---|---|---|
| Intégration | Externe (Webhook) | Native au dépôt |
| SAST / sécurité | Semgrep, Trivy | Semgrep, Trivy + **CodeQL** |
| Dépendances | `npm audit` | `npm audit` + **Dependabot** |

---

## 18. Git Workflow

### 79 - Stratégie de branches : branch → Pull Request → review → merge

Aucun développement n'est fait directement sur `main`. On utilise des branches thématiques (`feat/`, `fix/`, etc.).

### 80 - Protection de la branche `main` et interdiction du push direct

La branche `main` est protégée : PR obligatoire, 1 approbation requise, et interdiction des push directs.

### 81 - Contrôles obligatoires avant merge d'une Pull Request

Quatre contrôles de statut sont obligatoires pour pouvoir merger :
1. `Tests frontend et API`
2. `Secrets, SAST et dependances`
3. `Build et scan des images Docker`
4. `Analyse CodeQL`

![Pull Request bloquée par un contrôle en échec](screenshots/81-pr-bloquee.png)

### 82 - Conventional Commits

Les messages de commit suivent la convention : `feat:`, `fix:`, `docs:`, `chore:`, etc.

### 83 - Semantic Versioning (SemVer)

Les releases sont numérotées `MAJOR.MINOR.PATCH`. Le type du commit détermine l'incrément.

### 84 - Génération automatique du changelog et des releases

Le workflow `.github/workflows/release.yml` utilise **semantic-release** pour créer automatiquement les tags et les releases GitHub avec changelog.

![Release générée automatiquement par semantic-release](screenshots/84-release.png)

---

## 19. Optimisation des images

### 85 - État des lieux (Avant optimisation)

| Indicateur | Image API (Alpine) | Image Portfolio (Next.js) |
|---|---|---|
| Taille image | ~250 Mo | ~150 Mo |
| Temps de build | ~45s | ~1m 15s |
| Vulnérabilités | 0 | 0 |

### 86 - Build Multi-stage

Les Dockerfiles utilisent le multi-stage build pour séparer l'environnement de build de l'environnement d'exécution final, réduisant ainsi la taille et la surface d'attaque.

### 87 - Comparaison après optimisation

| Indicateur | Image API (Optimisée) | Image Portfolio (Optimisée) | Gain |
|---|---|---|---|
| Taille image | **~120 Mo** | **~90 Mo** | **-50% env.** |
| Temps de build | ~40s | ~1m | Gain léger |

### 88 & 89 - Docker Buildx et Multi-architecture (amd64, arm64)

Le pipeline utilise `docker/setup-buildx-action` pour construire des images compatibles `amd64` et `arm64`.

![Build multi-architecture avec Docker Buildx](screenshots/89-buildx-multiarch.png)

---

## 20. Registre privé Harbor

### 90 - Installation de Harbor

Harbor a été installé sur la VM Ubuntu (`192.168.237.130`) via Docker Compose. Il sert de registre privé pour stocker nos images Docker de manière sécurisée et centralisée.

![Dashboard Harbor](screenshots/90-harbor-dashboard.png)

### 91 - Publication des images dans Harbor

Les images sont poussées vers Harbor avec le nommage suivant :
- **API** : `192.168.237.130:8090/portfolio/devsecops-api:tag`
- **Frontend** : `192.168.237.130:8090/portfolio/devsecops-portfolio:tag`

![Images dans Harbor](screenshots/91-harbor-images.png)

### 92 - RBAC et Robot Accounts

L'accès est segmenté par projet. Un **Robot Account** a été créé spécifiquement pour le pipeline CI/CD, limitant les permissions à la publication (`push`) et à la lecture (`pull`) dans le projet `portfolio`.

### 93 - Scan automatique et comparaison

Harbor utilise Trivy pour scanner les images à chaque push.
- **Comparaison** : Le scan Harbor est plus complet car il persiste l'historique des vulnérabilités et permet de bloquer le téléchargement d'images vulnérables au niveau du registre.

![Scan de vulnérabilités Harbor](screenshots/93-harbor-scan.png)

### 94 - Politique de rétention

Une règle de rétention a été configurée pour ne conserver que les **5 dernières images** par dépôt, afin d'optimiser l'espace disque de la VM.

![Politique de rétention Harbor](screenshots/94-harbor-retention.png)

### 95 - Comparaison : GHCR vs Harbor

| Critère | GitHub Container Registry (GHCR) | Harbor (Privé) |
|---|---|---|
| Hébergement | Cloud (SaaS) | Auto-hébergé (On-premise) |
| Intégration | Native à GitHub Actions | Indépendant, via Docker Login |
| Sécurité | Scan basique | Scan Trivy avancé + RBAC fin |
| Coût | Gratuit (public) / Payant (privé) | Gratuit (Open Source) mais coût infra |

---

**Dépôt :** https://github.com/nourkidoudi/tp-devops
