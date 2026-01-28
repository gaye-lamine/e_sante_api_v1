backend/
├─ src/
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ domain/
│  │  │  │  └─ user.ts           # Entité utilisateur
│  │  │  ├─ application/
│  │  │  │  └─ auth.service.ts   # Cas d'usage : register/login
│  │  │  ├─ infrastructure/
│  │  │  │  └─ user.repository.ts
│  │  │  └─ presentation/
│  │  │     └─ auth.controller.ts
│  │  │
│  │  └─ health_metrics/
│  │     ├─ domain/
│  │     │  └─ health_metric.ts  # Entité + règles de validation
│  │     ├─ application/
│  │     │  └─ health.service.ts # Cas d’usage CRUD metrics
│  │     ├─ infrastructure/
│  │     │  └─ health.repository.ts
│  │     └─ presentation/
│  │        └─ health.controller.ts
│  │
│  ├─ shared/
│  │  ├─ utils/                   # fonctions utilitaires
│  │  └─ errors/                  # classes d’erreurs communes
│  │
│  ├─ app.ts                       # Configuration Express + routes
│  └─ server.ts                    # Lancement du serveur
├─ package.json
└─ tsconfig.json
