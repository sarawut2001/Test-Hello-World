pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ci-cd-nodejs-hello-world'
        DOCKER_TAG = 'latest'
        GITHUB_REPO = 'https://github.com/sarawut2001/Test-Hello-World.git'
        DOCKER_USERNAME = 'sarawut2001'
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
                    // ใช้ kubectl ในโหมด dry-run เพื่อตรวจสอบการใช้งานได้ของไฟล์
                    sh '''
                        export KUBECONFIG=/var/jenkins_home/.kube/config
                        kubectl apply -f kubernetes/deployment.yaml
                    '''
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