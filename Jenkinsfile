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
        // Étape 22 & 63 : récupération automatique du dépôt et calcul du Git SHA
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
                echo "Git Commit SHA : ${env.GIT_SHA}"
                sh 'git log -1 --oneline'
            }
        }

        // Étape 23 : installation des dépendances du frontend et de l'API
        stage('Install dependencies') {
            steps {
                echo '=== Installation des dépendances Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm ci --no-audit --no-fund'
                }
                echo '=== Installation des dépendances API Express ==='
                dir('api') {
                    sh 'npm ci --no-audit --no-fund'
                    sh 'npx prisma generate'
                }
            }
        }

        // Étape 61 : exécution automatique des tests du frontend
        stage('Test Frontend') {
            steps {
                echo '=== Exécution des tests Frontend Next.js ==='
                dir('portfolio-next') {
                    sh 'npm test'
                }
            }
        }

        // Étape 61 : exécution automatique des tests de l\'API
        stage('Test API') {
            steps {
                echo '=== Exécution des tests API Express ==='
                dir('api') {
                    sh 'npm test'
                }
            }
        }

        // Étape 24 : construction de l'application Next.js
        stage('Build Frontend') {
            steps {
                dir('portfolio-next') {
                    sh 'npm run build'
                }
            }
        }

        // Étapes 62 et 63 : construction automatique des images Docker avec tag Git SHA
        stage('Build Docker Images') {
            steps {
                echo "=== Construction des images Docker avec le tag Git SHA : ${env.GIT_SHA} ==="
                sh "docker build -t devsecops-portfolio:${env.GIT_SHA} -t devsecops-portfolio:latest ./portfolio-next"
                sh "docker build -t devsecops-api:${env.GIT_SHA} -t devsecops-api:latest ./api"
                echo '=== Vérification des images Docker générées ==='
                sh 'docker images | grep devsecops || true'
            }
        }
    }

    post {
        success {
            echo "Pipeline terminé avec succès : tests validés et images construites avec le tag ${env.GIT_SHA}."
        }
        failure {
            echo 'Le pipeline a échoué : consulter la console du stage en erreur.'
        }
    }
}