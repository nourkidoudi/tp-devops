// Pipeline Jenkins du DevSecOps Portfolio
pipeline {
    agent any

    options {
        // Le checkout est fait explicitement dans le premier stage
        skipDefaultCheckout(true)
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
        NEXT_TELEMETRY_DISABLED = '1'
        GIT_SHA = ''
    }

    stages {
        // Etape 22 & 63 : recuperation automatique du depot et calcul du Git SHA
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Git Commit SHA : ${env.GIT_SHA}"
                }
                sh 'git log -1 --oneline'
            }
        }

        // Etape 23 : installation des dependances du frontend et de l API
        stage('Install dependencies') {
            steps {
                echo '=== Installation des dependances Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm ci --no-audit --no-fund'
                }
                echo '=== Installation des dependances API Express ==='
                dir('api') {
                    sh 'npm ci --no-audit --no-fund'
                    sh 'npx prisma generate'
                }
            }
        }

        // Etape 61 : execution automatique des tests du frontend
        stage('Test Frontend') {
            steps {
                echo '=== Execution des tests Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm test'
                }
            }
        }

        // Etape 61 : execution automatique des tests de l API
        stage('Test API') {
            steps {
                echo '=== Execution des tests API Express ==='
                dir('api') {
                    sh 'npm test'
                }
            }
        }

        // Etape 24 : construction de l application Next.js
        stage('Build Frontend') {
            steps {
                dir('portfolio-next') {
                    sh 'npm run build'
                }
            }
        }

        // Etapes 62 et 63 : construction automatique des images Docker avec tag Git SHA
        stage('Build Docker Images') {
            steps {
                script {
                    // Fallback au cas ou GIT_SHA serait vide (robustesse)
                    def sha = (env.GIT_SHA?.trim()) ?: sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "=== Construction des images Docker avec le tag Git SHA : ${sha} ==="
                    sh "docker build -t devsecops-portfolio:${sha} -t devsecops-portfolio:latest ./portfolio-next"
                    sh "docker build -t devsecops-api:${sha} -t devsecops-api:latest ./api"
                    echo '=== Verification des images Docker generees ==='
                    sh 'docker images | grep devsecops || true'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline termine avec succes : tests valides et images construites avec le tag ${env.GIT_SHA}."
        }
        failure {
            echo 'Le pipeline a echoue : consulter la console du stage en erreur.'
        }
    }
}
