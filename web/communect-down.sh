#! /bin/bash
echo "---comunect---"

cd ../frontend
echo "---frontend---"
docker compose down
echo "---frontend---"

cd ../backend
echo "---backend---"
docker compose down
echo "---backend---"

cd ../db
echo "---db---"
docker compose down
echo "---db---"

cd ./nginx-proxy
echo "---nginx-proxy---"
docker compose down
echo "---nginx-proxy---"

echo "---comunect---"
