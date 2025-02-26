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
                    docker.image('bitnami/kubectl:latest').inside('--entrypoint="" -u 0:0') {  // รันด้วย root (uid 0, gid 0)
                        sh """
                            mkdir -p /root/.kube
                            cp /var/jenkins_home/.kube/config /root/.kube/config
                            kubectl apply -f kubernetes/deployment.yaml
                        """
                    }
                }
            }
        }

        stage('Run Grafana') {
            steps {
                script {
                    def grafanaPodName = ""
                    docker.image('dtzar/helm-kubectl:latest').inside('-u root') {  // ใช้ image และ user ที่เหมาะสม
                        sh """
                            # หา pod name ของ Grafana ใน namespace monitoring
                            grafanaPodName=\$(kubectl --namespace monitoring get pod -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=prometheus-operator" -o jsonpath="{.items[0].metadata.name}")
                            echo "Starting Port-Forward for Grafana pod: \$grafanaPodName"
                            echo "Access Grafana at http://localhost:3000 during pipeline execution"
                            # ทำ Port-Forward ไปยัง localhost:3000
                            kubectl --namespace monitoring port-forward \$grafanaPodName 3000:3000 &
                        """
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


