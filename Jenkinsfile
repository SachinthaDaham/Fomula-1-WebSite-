pipeline {
    agent any

    environment {
        // Environment stubs for MongoDB and JWT (needed for Next.js build if referenced)
        MONGODB_URI = 'mongodb://localhost:27017/f1'
        JWT_SECRET  = 'dummy_secret_for_build'
        
        // Configure local Node.js path for the Jenkins container
        NODE_DIR = "${env.WORKSPACE}/node_custom"
        PATH = "${env.WORKSPACE}/node_custom/bin:${env.PATH}"
    }

    stages {
        stage('Initialize') {
            steps {
                echo 'Initializing F1 Manager Intelligence Pipeline...'
                sh '''
                    if [ ! -x "$NODE_DIR/bin/node" ]; then
                        echo "Node.js not found. Downloading Node.js v20..."
                        curl -fsSL https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.gz | tar -xz
                        mkdir -p "$NODE_DIR"
                        cp -r node-v20.11.1-linux-x64/* "$NODE_DIR/"
                        rm -rf node-v20.11.1-linux-x64
                    fi
                '''
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Synchronizing Packages...'
                sh 'npm install'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running NSA-Level Threat Detection...'
                // Run npm audit. We use || true so it doesn't fail the build immediately 
                // on vulnerabilities, but logs it for review.
                sh 'npm audit --audit-level=high || true'
            }
        }

        stage('Static Analysis (Lint)') {
            steps {
                echo 'Running Telemetry Code Quality Checks...'
                sh 'npm run lint'
            }
        }

        stage('Build Production') {
            steps {
                echo 'Generating Optimization Binary (Next.js Build)...'
                sh 'npm run build'
            }
        }

        stage('Package Release') {
            steps {
                echo 'Bundling Standalone Telemetry Server...'
                // Compress the standalone output for a lightweight deployment payload
                sh 'tar -czf release-candidate.tar.gz .next/standalone .next/static public'
            }
        }
    }

    post {
        success {
            echo 'PIPELINE_COMPLETE: Deployment candidates ready.'
            // Archive the artifact so it can be downloaded from the Jenkins UI
            archiveArtifacts artifacts: 'release-candidate.tar.gz', fingerprint: true
        }
        failure {
            echo 'PIPELINE_TERMINATED: Critical failure detected in stream.'
        }
    }
}
