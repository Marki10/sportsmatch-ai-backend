@echo off
REM Docker Fix Script for Windows - Cleans corrupted Docker cache and rebuilds

echo 🧹 Cleaning Docker cache and corrupted images...

REM Stop and remove containers
docker-compose -f docker-compose.minimal.yml down -v 2>nul

REM Remove the corrupted image
docker rmi sportsmatch-ai-backend-app 2>nul
if errorlevel 1 echo Image not found (already removed)

REM Clean Docker system
docker system prune -f

REM Clean build cache
docker builder prune -f

echo ✅ Cleanup complete!
echo.
echo 🔨 Building fresh image...

REM Build with no cache
docker-compose -f docker-compose.minimal.yml build --no-cache

echo ✅ Build complete!
echo.
echo 🚀 Starting the app...

REM Start the app
docker-compose -f docker-compose.minimal.yml up

