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

        stage('Monitor Setup') {
            steps {
                script {
                    def grafanaPodName = ""
                    docker.image('dtzar/helm-kubectl:latest').inside('-u root') {
                        sh """
                            # ตรวจสอบว่า namespace monitoring ถูกสร้างหรือไม่
                            kubectl get namespace monitoring || kubectl create namespace monitoring
                            # ตรวจสอบว่า release prometheus-operator ยังคงอยู่ใน namespace monitoring หรือไม่
                            if helm ls -n monitoring | grep -q prometheus-operator; then
                                echo "Using existing prometheus-operator release in monitoring namespace"
                                # อัปเดต release (ถ้าจำเป็น)
                                helm upgrade prometheus-operator prometheus-community/kube-prometheus-stack --namespace monitoring
                            else
                                echo "Installing new prometheus-operator release in monitoring namespace"
                                helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                                helm repo update
                                helm install prometheus-operator prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
                            fi
                            # หา pod name ของ Grafana
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


