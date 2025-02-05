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
                git branch: 'main', url: "${env.GITHUB_REPO}"
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
                script {
                    docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_TOKEN')]) {
                    sh '''
                        echo $DOCKER_TOKEN | docker login -u $DOCKER_USERNAME --password-stdin
                        docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG
                        docker push $DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying application..."
                    docker stop $DOCKER_IMAGE || true
                    docker rm $DOCKER_IMAGE || true
                    docker run -d --name $DOCKER_IMAGE \
                        -p 3000:3000 \
                        $DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG npm start
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
