# 1.0.0 (2026-11-01)


### Bug Fixes

* **ci:** corrige le scan Trivy et le build Docker du pipeline DevSecOps ([d70eec0](https://github.com/nourkidoudi/tp-devops/commit/d70eec0c943629c022da40fbeb06bfa28c2d8b7d))
* correction propagation GIT_SHA dans Build Docker Images (etape 63) ([543a5b4](https://github.com/nourkidoudi/tp-devops/commit/543a5b4135aa72e36271cf4d5575b0c3280195aa))
* corriger la récupération du Git SHA dans le pipeline Jenkins ([aa27f05](https://github.com/nourkidoudi/tp-devops/commit/aa27f05ae2741f29a13622d25ac46229d15452d3))
* **frontend:** augmenter le timeout npm pour le build en VM imbriquée ([cd3748f](https://github.com/nourkidoudi/tp-devops/commit/cd3748f3c31af9bd08090a259a2c36d93edbfa15))
* ignorer l'alerte CSRF de Semgrep pour le pipeline ([8955d5c](https://github.com/nourkidoudi/tp-devops/commit/8955d5cf89dd68ca173ea7fbe675eeed73dc55e0))
* suppression du BOM UTF-8 dans Jenkinsfile (causait MissingPropertyException) ([c9b989a](https://github.com/nourkidoudi/tp-devops/commit/c9b989a27c0e7e0b20d805304b0f29f29ad38923))


### Features

* ajout base PostgreSQL, migrations Prisma et persistance du formulaire de contact (étapes 53 à 56) ([a86d242](https://github.com/nourkidoudi/tp-devops/commit/a86d2423291eda56e53d3dbc15afe27180b5ffba))
* ajout tests applicatifs frontend, api, securite et integration (etapes 57 a 60) ([708e6c9](https://github.com/nourkidoudi/tp-devops/commit/708e6c9a6a08d99e5f400dd74d3bfd27c0719281))
* **ci:** ajoute les workflows GitHub Actions, CodeQL, Dependabot et semantic-release ([6259cf5](https://github.com/nourkidoudi/tp-devops/commit/6259cf5d7948d31dbf1733ba15692153e8aa2512))


### Performance Improvements

* cache Docker et base Trivy persistante pour accelerer le pipeline ([a8cc711](https://github.com/nourkidoudi/tp-devops/commit/a8cc71154003d2b2128fc336357802af187795ed))
* docker build avec --cache-from + try/catch pour robustesse sur VM (etapes 62-63) ([1dc2d4b](https://github.com/nourkidoudi/tp-devops/commit/1dc2d4ba86e6b0041763afebfb0c724184984e5f))
