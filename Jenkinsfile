pipeline {
    agent any

    environment {
        IMAGE_NAME = "ci-cd-nodejs-hello-world"
        IMAGE_TAG  = "latest"
        DOCKER_REPO = "sarawut2001/${IMAGE_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                git 'https://github.com/sarawut2001/Test-Hello-World.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.image('node:22').inside {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    docker.image('node:22').inside {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f Dockerfile ."
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_TOKEN')]) {
                    sh """
                        echo "$DOCKER_TOKEN" | docker login -u sarawut2001 --password-stdin
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REPO}:${IMAGE_TAG}
                        docker push ${DOCKER_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying application..."
                    docker stop ${DOCKER_IMAGE} || true
                    docker rm ${DOCKER_IMAGE} || true
                    docker run -d --name ${DOCKER_IMAGE} -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                '''
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
            cleanWs()
        }
        success {
            echo '✅ Pipeline สำเร็จ!'
        }
        failure {
            echo '❌ Pipeline ล้มเหลว! ตรวจสอบล็อกเพื่อดูรายละเอียด'
        }
    }
}
