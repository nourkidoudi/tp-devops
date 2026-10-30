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
        GIT_SHA = ''
    }

    stages {
        // Etapes 22 & 63 : recuperation du depot et calcul du Git SHA
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

        // Etape 23 : installation des dependances
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
            }
        }

        // Etapes 62 & 63 : images Docker avec tag Git SHA
        stage('Build Docker Images') {
            steps {
                script {
                    echo "=== Construction des images Docker tag: ${env.GIT_SHA} ==="
                    // Construction des images avec le tag Git SHA et le tag latest
                    sh "docker build -t devsecops-api:${env.GIT_SHA} -t devsecops-api:latest ./api"
                    sh "docker build -t devsecops-portfolio:${env.GIT_SHA} -t devsecops-portfolio:latest ./portfolio-next"
                    
                    echo '=== Images Docker generees ==='
                    sh 'docker images | grep devsecops'
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
