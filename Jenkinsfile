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

    
        stage('Test') {
            agent {
                docker { image 'node:22' }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.DOCKER_USERNAME}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_TOKEN')]) {
                    sh '''
                        echo $DOCKER_TOKEN | docker login -u $DOCKER_USERNAME --password-stdin
                        
                        docker push $DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def containerExists = sh(script: "docker ps -a -q -f name=$DOCKER_IMAGE", returnStdout: true).trim()
                    if (containerExists) {
                        sh "docker stop $DOCKER_IMAGE && docker rm $DOCKER_IMAGE"
                    }
                    sh '''
                        docker run -d --name $DOCKER_IMAGE \
                            -p 8888:8888 \
                            $DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG \
                            sh -c "npm start"
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


