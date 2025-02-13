pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sakshi0202/cloudnotes-app"
        DOCKER_CREDENTIALS_ID = "docker-credentials"
        K8S_NAMESPACE = "cloudnotes"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/sakshi0202/Cloud-notes.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                    kubectl apply -f k8s/frontend-deployment.yaml -n ${K8S_NAMESPACE}
                    kubectl apply -f k8s/backend-deployment.yaml -n ${K8S_NAMESPACE}
                    kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE}
                    kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}
