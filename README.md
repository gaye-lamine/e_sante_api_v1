# E-Sante API 🏥

Une API robuste et sécurisée pour le suivi des métriques de santé, conçue avec une architecture propre (Clean Architecture) et suivant les principes du Domain-Driven Design (DDD).

## 🚀 Fonctionnalités

- **Authentification JWT** : Inscription et connexion sécurisées.
- **Gestion des Métriques** : Suivi du poids, de la tension artérielle et du taux de glucose.
- **Validation stricte** : Utilisation de Zod pour garantir l'intégrité des données.
- **Architecture Propre** : Séparation claire des responsabilités (Domain, Application, Infrastructure, Presentation).
- **PostgreSQL** : Persistance des données avec initialisation automatique du schéma.
- **CI/CD Ready** : Configurations Docker et Jenkins incluses.

## 🛠️ Stack Technique

- **Runtime** : Node.js
- **Langage** : TypeScript
- **Framework Web** : Express.js
- **Base de données** : PostgreSQL
- **Validation** : Zod
- **Tests** : Jest & Supertest
- **DevOps** : Docker, Docker Compose, Jenkins

## 📦 Installation et Lancement

### Prérequis

- Node.js (v20+)
- Docker & Docker Compose (optionnel pour le lancement local)
- PostgreSQL (si lancé sans Docker)

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine (voir `.env.example` ou utilisez les valeurs par défaut) :

```env
PORT=3000
JWT_SECRET=votre_secret_jwt
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=e_sante
DB_PORT=5432
```

### Lancement Local (Développement)

```bash
npm run dev
```

### Lancement avec Docker (Recommandé)

```bash
docker-compose up --build
```

## 🧪 Tests et Qualité

### Exécuter les tests unitaires et d'intégration

```bash
npm test
```

### Couverture de tests (Coverage)

```bash
npm run test:coverage
```

### Linting (Vérification de types)

```bash
npm run lint
```

## 🏗️ Architecture du Projet

```text
src/
├── features/
│   ├── auth/            # Gestion des utilisateurs et authentification
│   └── health_metrics/  # Logique métier liée aux métriques de santé
├── shared/              # Code partagé (erreurs, middlewares, infrastructure commune)
├── app.ts               # Configuration Express et Injection de dépendances
└── server.ts            # Point d'entrée du serveur
```

## 🔌 API Endpoints

### Authentification
- `POST /auth/register` : Créer un nouveau compte.
- `POST /auth/login` : Se connecter et recevoir un token JWT.

### Métriques (Authentifié)
- `GET /metrics` : Liste toutes les métriques de l'utilisateur.
- `POST /metrics` : Ajouter une nouvelle métrique (poids, tension, glucose).
- `DELETE /metrics/:id` : Supprimer une métrique.

## 🚢 CI/CD

Le projet inclut un `Jenkinsfile` prêt pour la production avec les étapes suivantes :
1. Installation des dépendances.
2. Linting TypeScript.
3. Tests avec couverture minimale.
4. Build de l'application.
5. Dockerisation de l'image de production.

---
Développé avec ❤️ pour la santé de demain.
