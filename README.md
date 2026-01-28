# E-Sante API

Une API robuste et sécurisée pour le suivi des métriques de santé, conçue avec une architecture propre (Clean Architecture) et suivant les principes du Domain-Driven Design (DDD).

## Fonctionnalités

- Authentification JWT : Inscription et connexion sécurisées.
- Gestion des Métriques : Suivi du poids, de la tension artérielle et du taux de glucose.
- **Rappels Santé (V2)** : Planification dynamique de rappels (Cron) avec relance automatique au démarrage.
- **Analyses & Tendances (V2)** : Calcul automatique des moyennes et détection de l'évolution (augmentation/baisse).
- **Export PDF (V2)** : Génération de bilans de santé professionnels téléchargeables.
- **Notifications (V2)** : Infrastructure multi-canal (Console, prêt pour Email/SMS).
- Validation stricte : Utilisation de Zod pour garantir l'intégrité des données.
- Architecture Propre : Séparation claire des responsabilités (Domain, Application, Infrastructure, Presentation).
- PostgreSQL : Persistance des données avec initialisation automatique du schéma.
- CI/CD Ready : Configurations Docker et Jenkins incluses.

## Stack Technique

- Runtime : Node.js
- Langage : TypeScript
- Framework Web : Express.js
- Base de données : PostgreSQL
- Validation : Zod
- Tests : Jest & Supertest
- DevOps : Docker, Docker Compose, Jenkins

## Installation et Lancement

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

## Tests et Qualité

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

## Architecture du Projet

```text
src/
├── features/
│   ├── auth/            # Gestion des utilisateurs et authentification
│   └── health_metrics/  # Logique métier liée aux métriques de santé
├── shared/              # Code partagé (erreurs, middlewares, infrastructure commune)
├── app.ts               # Configuration Express et Injection de dépendances
└── server.ts            # Point d'entrée du serveur
```

## API Endpoints

### Authentification
- `POST /auth/register` : Créer un nouveau compte.
- `POST /auth/login` : Se connecter et recevoir un token JWT.

### Métriques (Authentifié)
- `GET /metrics` : Liste toutes les métriques de l'utilisateur.
- `POST /metrics` : Ajouter une nouvelle métrique (poids, tension, glucose).
- `GET /metrics/insights` : Récupérer l'analyse des tendances et moyennes.
- `GET /metrics/export` : Télécharger le rapport de santé au format PDF.
- `DELETE /metrics/:id` : Supprimer une métrique.

### Rappels (Authentifié)
- `POST /reminders` : Créer un rappel programmé (format Cron).
- `GET /reminders` : Lister ses rappels.
- `PATCH /reminders/:id/toggle` : Activer ou désactiver un rappel.
- `DELETE /reminders/:id` : Supprimer un rappel.

## CI/CD

Le projet inclut des configurations robustes pour l'intégration et le déploiement continus :

- **GitHub Actions** : Automatique sur chaque push et pull request (Lint, Test, Build Docker).
- **Jenkins** : `Jenkinsfile` prêt pour une infrastructure Jenkins auto-hébergée.

Les étapes automatisées incluent :
1. Installation des dépendances.
2. Linting TypeScript.
3. Tests avec couverture complète.
4. Build de l'application.
5. Création de l'image Docker de production.

---
Développé pour la santé de demain.
