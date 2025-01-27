#! /bin/bash
echo "---comunect---"

cd ./nginx-proxy
echo "---nginx-proxy---"
docker compose build
docker compose up -d
echo "---nginx-proxy---"

cd ../db
echo "---db---"
docker compose build
docker compose up -d
echo "---db---"

cd ../backend
echo "---backend---"
docker compose build
docker compose up -d
echo "---backend---"

cd ../frontend
echo "---frontend---"
docker compose build
docker compose up -d
echo "---frontend---"

echo "---comunect---"
