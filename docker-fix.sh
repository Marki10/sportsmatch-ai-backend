#!/bin/bash

# Docker Fix Script - Cleans corrupted Docker cache and rebuilds

echo "🧹 Cleaning Docker cache and corrupted images..."

# Stop and remove containers
docker-compose -f docker-compose.minimal.yml down -v 2>/dev/null || true

# Remove the corrupted image
docker rmi sportsmatch-ai-backend-app 2>/dev/null || echo "Image not found (already removed)"

# Clean Docker system
docker system prune -f

# Clean build cache
docker builder prune -f

echo "✅ Cleanup complete!"
echo ""
echo "🔨 Building fresh image..."

# Build with no cache
docker-compose -f docker-compose.minimal.yml build --no-cache

echo "✅ Build complete!"
echo ""
echo "🚀 Starting the app..."

# Start the app
docker-compose -f docker-compose.minimal.yml up

