# Python Code Execution Engine

This project is a Python code execution engine built with an ExpressJS server. It uses Redis for IP blocking, MongoDB for storage, and is hosted using Docker Compose and Kubernetes.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
- Docker
- Docker Compose
- Kubernetes (Minikube, k3s, etc.)
- Node.js
- Python

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/arya2004/python-executor-library.git
    cd python-code-execution-engine
    ```

2. Set up environment variables:
    Create a `.env` file with the necessary configurations (see `.env.example`).

3. Start services with Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. Deploy on Kubernetes:
    ```bash
    kubectl apply -f k8s/
    ```

## Usage

### API Endpoints
- **POST** `/execute`
  - Executes the given Python code.
  - Request Body:
    ```json
    {
      "code": "print('Hello, World!')"
    }
    ```
  - Response:
    ```json
    {
      "output": "Hello, World!\n"
    }
    ```

### Blocking IPs
- Redis is used to manage IP blocking to prevent abuse.

## Configuration

### Environment Variables
- `REDIS_URL`: URL for the Redis instance.
- `MONGO_URI`: URI for MongoDB connection.
- `PORT`: Port for the Express server.

### Docker Compose
- `docker-compose.yml`: Configuration file for Docker Compose.

### Kubernetes
- `k8s/`: Directory containing Kubernetes deployment files.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License
This project is licensed under the CC0-1.0 license - see the [LICENSE](./LICENSE) file for details.
