#!/bin/sh

echo "Updating to latest code..."
git fetch origin main
git reset --hard origin/main
git clean -fd

echo "Build & Push Update Image"
docker compose build && docker compose push

echo "Re run new compose"
docker compose down && docker compose up -d