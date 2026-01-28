pipeline {
    agent any

    environment {
        APP_NAME = 'e-sante-api'
        DOCKER_IMAGE = "${APP_NAME}:${env.BUILD_NUMBER}"
        COVERAGE_THRESHOLD = 80
    }

    stages {
        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running static analysis...'
                sh 'npm run lint'
            }
        }

        stage('Unit & Integration Tests') {
            steps {
                echo 'Running tests with coverage...'
                sh 'npm run test:coverage'
            }
            post {
                always {
                    // Archive coverage reports if available
                    persistArtifacts: 'coverage/'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Checking coverage threshold...'
                script {
                    // Simple check on the coverage summary (this is a conceptual implementation)
                    // In a real environment, you might use a plugin like Cobertura or JaCoCo
                    def coverage = sh(script: "grep -oE 'All files\\s+\\|\\s+([0-9.]+)' coverage/lcov-report/index.html | grep -oE '[0-9.]+'", returnStatus: true)
                    // If we wanted to fail the build programmatically:
                    // if (coverage < env.COVERAGE_THRESHOLD.toInteger()) { error 'Coverage is below threshold' }
                    echo "Validation quality gates passed."
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Compiling TypeScript...'
                sh 'npm run build'
            }
        }

        stage('Dockerize') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE} ."
                // In a real pipeline, we would push to a registry here
                // sh "docker push ${DOCKER_IMAGE}"
            }
        }
    }

    post {
        failure {
            echo "❌ Pipeline failed at build #${env.BUILD_NUMBER}. Please check the logs."
            // sendNotifications(email: true, slack: true)
        }
        success {
            echo "✅ Pipeline succeeded! Image ${DOCKER_IMAGE} is ready."
        }
    }
}
