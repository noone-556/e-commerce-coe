# One command to bring up the whole stack on Windows:   .\setup.ps1
# It checks Docker, creates .env if needed, builds the images one at a time, and starts everything.

Set-Location $PSScriptRoot

Write-Host "1/4 Checking that Docker is running..."
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Start Docker Desktop, wait for 'engine running', then try again." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env from .env.example"
}

#Build image one at a time
Write-Host "2/4 Building the backend image (the first time takes a few minutes)..."
docker compose build backend
if ($LASTEXITCODE -ne 0) { exit 1}

Write-Host "3/4 Building the frontend image...."
docker compose build frontend
if ($LASTEXITCODE -ne 0) {exit 1}

Write-Host "4/4 Starting everything and waiting until it is healthy..."
docker compose up -d --wait
if ($LASTEXITCODE -ne 0) {
    Write-Host "Something failed to start. See the logs with: docker compose logs" -ForegroundColor Red
    exit 1
}

Write-Host "Ready! Open http://localhost:8000" -ForegroundColor Green