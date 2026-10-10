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
    }

    stages {
        // Étape 22 : récupération automatique du dépôt GitHub
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
                sh 'ls -la'
            }
        }

        // Étape 23 : installation des dépendances du projet Next.js
        stage('Install dependencies') {
            steps {
                dir('portfolio-next') {
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'npm ci --no-audit --no-fund'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline terminé avec succès.'
        }
        failure {
            echo 'Le pipeline a échoué : consulter la console du stage en erreur.'
        }
    }
```groovy
        // Étape 24 : construction de l'application Next.js
        stage('Build') {
            steps {
                dir('portfolio-next') {
                    sh 'npm run build'
                }
            }
        }
```
}