#!/bin/bash
# Quick Docker Fix - Run all cleanup commands at once

echo "🧹 Step 1: Cleaning up containers..."
docker-compose -f docker-compose.minimal.yml down -v

echo "🗑️  Step 2: Removing corrupted image..."
docker rmi sportsmatch-ai-backend-app 2>/dev/null || echo "   (Image already removed or not found)"

echo "🧽 Step 3: Cleaning Docker system..."
docker system prune -f

echo "🧽 Step 4: Cleaning build cache..."
docker builder prune -f

echo ""
echo "🔨 Step 5: Building fresh image (this may take a few minutes)..."
docker-compose -f docker-compose.minimal.yml build --no-cache

echo ""
echo "🚀 Step 6: Starting the app..."
docker-compose -f docker-compose.minimal.yml up

