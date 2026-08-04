#!/usr/bin/env bash
# ==========================================
# SWIVIQ — Pipeline de déploiement direct
# Usage (Git Bash) :  bash deploy.sh
#
#   1. build Angular SSR (frontend)
#   2. package frontend/dist + backend/src
#   3. envoi sur le VPS via SSH (alias "contabo")
#   4. npm ci production + reload PM2
# ==========================================
set -euo pipefail
cd "$(dirname "$0")"

SSH_HOST="contabo"
ARCHIVE=".release.tar.gz"

echo "==> 1/4  Build frontend (Angular SSR)"
(cd frontend && npm run build)

echo "==> 2/4  Préparation de la release"
rm -rf .release "$ARCHIVE"
mkdir -p .release/frontend .release/backend
cp -r frontend/dist .release/frontend/dist
cp frontend/package.json frontend/package-lock.json .release/frontend/
cp -r backend/src .release/backend/src
cp backend/package.json backend/package-lock.json .release/backend/
cp deploy/ecosystem.config.cjs .release/
tar -czf "$ARCHIVE" -C .release .

echo "==> 3/4  Envoi vers le VPS"
scp -q "$ARCHIVE" "$SSH_HOST:/tmp/swiviq-release.tar.gz"

echo "==> 4/4  Installation + redémarrage PM2"
ssh "$SSH_HOST" bash -s <<'REMOTE'
set -e
cd /var/www/swiviq
tar -xzf /tmp/swiviq-release.tar.gz
rm -f /tmp/swiviq-release.tar.gz
(cd backend  && npm ci --omit=dev --silent)
(cd frontend && npm ci --omit=dev --silent)
pm2 startOrReload ecosystem.config.cjs --only swiviq-api,swiviq-ssr
pm2 save --force
REMOTE

rm -rf .release "$ARCHIVE"
echo ""
echo "✅ Déploiement terminé : https://swiviq.com"
