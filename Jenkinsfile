pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ci-cd-nodejs-hello-world'
        DOCKER_TAG = 'latest'
        GITHUB_REPO = 'https://github.com/sarawut2001/Test-Hello-World.git'
        DOCKER_USERNAME = 'sarawut2001'
        KUBECONFIG = '/var/jenkins_home/.kube/config'  // Config Kubernetes (ต้อง mount ใน container)
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                git branch: 'main', credentialsId: 'github-token', url: "${env.GITHUB_REPO}"
            }
        }
    

    stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.DOCKER_USERNAME}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Test') {
            agent {
                docker { image 'node:22' }
            }
            steps {
                sh 'npm install mocha --save-dev'
                sh 'npm test'
            }
        }

        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        def customImage = docker.image("${env.DOCKER_USERNAME}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                        customImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Mount kubeconfig และใช้ kubectl ผ่าน container
                    docker.image('bitnami/kubectl:latest').inside {
                        sh """
                            mkdir -p /root/.kube
                            cp ${env.KUBECONFIG} /root/.kube/config
                            kubectl apply -f kubernetes/deployment.yaml
                        """
                    }
                }
            }
        }

        stage('Monitor Setup') {
            steps {
                script {
            // คัดลอก values.yaml จาก repo
                    sh 'cp kubernetes/values.yaml .'
                    docker.image('bitnami/kubectl:latest').inside {
                        sh """
                            helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                            helm repo update
                            helm install prometheus-operator prometheus-community/kube-prometheus-stack --namespace monitoring --values values.yaml --create-namespace
                        """
                    }
                }
            }
        }
    }

    post {

        success {
            echo '✅ Pipeline Successful!'
        }
        failure {
            echo '❌ Pipeline Fail! Check the log for details.'
        }
    }
}


