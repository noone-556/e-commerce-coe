#!/usr/bin/env bash
# One command to bring up the whole stack on Mac / Linux / Git Bash:   ./setup.sh
# It checks Docker, creates .env if needed, builds the images one at a time, and starts everything.
set -euo pipefail
cd "$(dirname "$0")"

echo "1/4 Checking that docker is running..."
if ! docker info > dev/null 2>&1; then
    echo "Docker is not running. Start Docker, then try again."
    exit 1
fi

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

# Build one image at a time:
echo "2/4 Building the backend image (the first time takes a few minutes)..."
docker compose build backend

echo "3/4 Building the frontend image..."
docker compose build frontend 

echo "4/4 Starting everything and waiting until it is healthy..."
docker compose up -d --wait

echo "Ready! Open http://localhost:8000"