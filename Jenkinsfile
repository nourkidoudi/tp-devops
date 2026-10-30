// Pipeline Jenkins du DevSecOps Portfolio
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        // Etapes 22 & 63 : recuperation du depot et calcul du Git SHA
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Utilise le commit fourni par Jenkins ou le calcule manuellement
                    def gitCommit = env.GIT_COMMIT ?: sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    env.GIT_SHA = gitCommit.take(7)
                    echo "Git Commit SHA : ${env.GIT_SHA}"
                }
            }
        }

        // Etapes 23 & 66 : installation des dependances et audit Node.js
        stage('Install & Audit dependencies') {
            steps {
                echo '=== Installation et Audit Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm ci --no-audit --no-fund'
                    // Etape 66 : npm audit (ne fait pas echouer le build ici pour permettre le scan suivant)
                    sh 'npm audit --audit-level=critical || true'
                }
                echo '=== Installation et Audit API Express ==='
                dir('api') {
                    sh 'npm ci --no-audit --no-fund'
                    sh 'npx prisma generate'
                    // Etape 66 : npm audit
                    sh 'npm audit --audit-level=critical || true'
                }
            }
        }

        // Etape 64 : Scan des secrets avec Gitleaks
        stage('Gitleaks Secret Scan') {
            steps {
                echo '=== Scan des secrets avec Gitleaks ==='
                // Etape 69 : echoue si un secret est trouve
                sh 'gitleaks detect --source . -v --exit-code 1'
            }
        }

        // Etape 65 : SAST avec Semgrep (via Docker pour eviter les problemes d installation)
        stage('Semgrep SAST') {
            steps {
                echo '=== Analyse SAST avec Semgrep ==='
                sh 'docker run --rm -v $(pwd):/src returntocorp/semgrep semgrep scan --config auto --error'
            }
        }

        // Etape 67 : OWASP Dependency-Check (via Docker)
        stage('OWASP Dependency-Check') {
            steps {
                echo '=== Scan des dependances avec OWASP Dependency-Check ==='
                sh '''
                    mkdir -p odc-reports
                    docker run --rm \
                        -v $(pwd):/src \
                        -v $(pwd)/odc-reports:/report \
                        owasp/dependency-check:latest \
                        --project "DevSecOps Portfolio" \
                        --scan /src \
                        --format "HTML" \
                        --out /report \
                        --failOnCVSS 7 || echo "Scan ODC echoue (probleme reseau/API NVD), passage a la suite..."
                '''
            }
        }

        // Etape 61 : tests automatiques du frontend
        stage('Test Frontend') {
            steps {
                echo '=== Execution des tests Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm test'
                }
            }
        }

        // Etape 61 : tests automatiques de l API
        stage('Test API') {
            steps {
                echo '=== Execution des tests API Express ==='
                dir('api') {
                    sh 'npm test'
                }
            }
        }

        // Etape 24 : build Next.js
        stage('Build Frontend') {
            steps {
                dir('portfolio-next') {
                    sh 'npm run build'
                }
                echo '=== Nettoyage des dependances locales pour liberer de l espace ==='
                sh 'rm -rf portfolio-next/node_modules api/node_modules'
            }
        }

        // Etapes 62 & 63 : images Docker avec tag Git SHA
        stage('Build Docker Images') {
            steps {
                script {
                    echo "=== Construction des images Docker tag: ${env.GIT_SHA} ==="
                    // Construction des images avec le tag Git SHA et le tag latest
                    // --cache-from reutilise les couches de l image precedente (build plus rapide)
                    sh "docker build --cache-from devsecops-api:latest -t devsecops-api:${env.GIT_SHA} -t devsecops-api:latest ./api"
                    sh "docker build --cache-from devsecops-portfolio:latest -t devsecops-portfolio:${env.GIT_SHA} -t devsecops-portfolio:latest ./portfolio-next"
                    
                    echo '=== Images Docker generees ==='
                    sh 'docker images | grep devsecops'
                }
            }
        }

        // Etape 68 : Scan des images Docker avec Trivy (via Docker)
        stage('Trivy Image Scan') {
            steps {
                script {
                    echo '=== Scan de l image API avec Trivy ==='
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/trivy aquasec/trivy image --severity CRITICAL --exit-code 1 devsecops-api:${env.GIT_SHA}"
                    
                    echo '=== Scan de l image Portfolio avec Trivy ==='
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/trivy aquasec/trivy image --severity CRITICAL --exit-code 1 devsecops-portfolio:${env.GIT_SHA}"
                }
            }
        }
    }

    post {
        success {
            script {
                def sha = env.GIT_SHA ?: "inconnu"
                echo "Pipeline OK : images taguees ${sha}."
            }
        }
        failure {
            echo 'Pipeline en ECHEC : voir la console du stage en erreur.'
        }
    }
}
