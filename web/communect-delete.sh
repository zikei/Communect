#! /bin/bash
echo "---comunect---"

cd ./frontend
echo "---frontend---"
docker compose down --rmi all --volumes --remove-orphans
echo "---frontend---"

cd ../backend
echo "---backend---"
docker compose down --rmi all --volumes --remove-orphans
echo "---backend---"

cd ../db
echo "---db---"
docker compose down --rmi all --volumes --remove-orphans
echo "---db---"

cd ../nginx-proxy
echo "---nginx-proxy---"
docker compose down --rmi all --volumes --remove-orphans
echo "---nginx-proxy---"

echo "---comunect---"
