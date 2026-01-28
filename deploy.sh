#!/bin/bash

# Script de déploiement pour E-Sante API sur VPS
# Usage: ./deploy.sh [staging|production]

ENV=${1:-production}
SSH_KEY="/Users/mac/Desktop/deploy/dev-ssh-key.pem"
SERVER_USER="ubuntu"
SERVER_HOST="ec2-13-39-19-215.eu-west-3.compute.amazonaws.com"
PROJECT_PATH="/var/www/html/apps/e_sante_api"

echo "🚀 Déploiement de E-Sante API - Environnement: $ENV"
echo "🌐 Serveur: $SERVER_HOST"

# Vérifier que la clé SSH existe
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Erreur: Clé SSH non trouvée à $SSH_KEY"
    exit 1
fi

# Branche actuelle
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Branche actuelle: $CURRENT_BRANCH"

# Pour ce projet, on déploie depuis 'main'
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️ Attention: Vous n'êtes pas sur la branche 'main'"
    read -p "Continuer le déploiement depuis '$CURRENT_BRANCH'? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Synchronisation locale
echo "🔄 Synchronisation locale et push vers le repository..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "ℹ️ Aucune modification à commiter"
git push origin "$CURRENT_BRANCH"

# Connexion au serveur et déploiement via Docker
echo "🔗 Connexion au serveur et déploiement via Docker..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" << EOF
    set -e
    
    echo "=== 🏗️ Mise à jour sur le serveur ==="
    
    # Créer le répertoire si inexistant
    mkdir -p "$PROJECT_PATH"
    cd "$PROJECT_PATH"
    
    # Initialiser git si nécessaire ou simplement pull
    if [ ! -d ".git" ]; then
        echo "📥 Initialisation du projet sur le serveur..."
        git clone https://github.com/gaye-lamine/e_sante_api_v1.git .
    else
        echo "📥 Récupération des dernières modifications..."
        git stash || true
        git pull origin "$CURRENT_BRANCH"
    fi
    
    # Vérifier l'existence du fichier .env
    if [ ! -f ".env" ]; then
        echo "⚠️ Fichier .env manquant sur le serveur!"
        echo "💡 Assurez-vous de configurer les variables d'environnement."
        # Optionnel: on peut copier un .env.example si besoin
        # cp .env.example .env
    fi
    
    # Installation des dépendances et Build
    echo "📦 Installation des dépendances NPM..."
    npm install --production=false # On a besoin de tsc pour le build
    
    echo "🏗️ Build de l'application..."
    npm run build
    
    # Vérifier l'existence du fichier .env
    if [ ! -f ".env" ]; then
        echo "⚠️ Fichier .env manquant sur le serveur!"
        echo "💡 Création d'un .env de base (à configurer)..."
        cp .env.example .env || echo "DATABASE_URL=..." > .env
    fi
    
    # Déploiement via PM2
    echo "🚀 Lancement/Redémarrage avec PM2..."
    pm2 delete e-sante-api || true
    pm2 start dist/server.js --name e-sante-api
    pm2 save
    
    echo "=== ✅ Déploiement terminé avec succès! ==="
EOF

echo "🏁 Déploiement terminé!"
