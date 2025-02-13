pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'sakshimhaske942'  // DockerHub username
        BACKEND_IMAGE = 'sakshimhaske942/cloudnotes-backend:latest'
        FRONTEND_IMAGE = 'sakshimhaske942/cloudnotes-frontend:latest'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/sakshi0202/Cloud-notes.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE -f Dockerfile .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE -f Dockerfile .'
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) {
                    sh 'docker push $BACKEND_IMAGE'
                    sh 'docker push $FRONTEND_IMAGE'
                }
            }
        }

        stage('Deploy PostgreSQL Database') {
            steps {
                sh '''
                kubectl apply -f k8s/postgres-pv.yaml
                kubectl apply -f k8s/postgres-pvc.yaml
                kubectl apply -f k8s/postgres-deployment.yaml
                '''
            }
        }

        stage('Deploy Backend & Frontend') {
            steps {
                sh '''
                kubectl apply -f k8s/backend-deployment.yaml
                kubectl apply -f k8s/frontend-deployment.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
