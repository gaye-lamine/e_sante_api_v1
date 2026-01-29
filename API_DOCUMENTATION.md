# Guide API E-Sante pour l'équipe React Native

Ce document décrit comment interagir avec l'API E-Sante depuis votre application mobile React Native.

## 📡 URL de Base

```
Production: http://13.39.19.215
```

Tous les endpoints sont préfixés par cette URL de base.

---

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification. Une fois connecté, vous devez inclure le token dans toutes les requêtes protégées.

### 1. Inscription d'un utilisateur

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "Dr. Amadou Diop",
  "email": "diop@esante.sn",
  "password": "Secure123!"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
      "name": "Dr. Amadou Diop",
      "email": "diop@esante.sn",
      "createdAt": "2026-01-29T11:02:27.059Z",
      "updatedAt": "2026-01-29T11:02:27.059Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**
- `400` : Données invalides (email déjà utilisé, mot de passe faible)
- `500` : Erreur serveur

---

### 2. Connexion

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "diop@esante.sn",
  "password": "Secure123!"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
      "name": "Dr. Amadou Diop",
      "email": "diop@esante.sn",
      "createdAt": "2026-01-29T11:02:27.059Z",
      "updatedAt": "2026-01-29T11:02:27.059Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles:**
- `401` : Email ou mot de passe incorrect
- `500` : Erreur serveur

---

## 📊 Gestion des Métriques de Santé

> **Important:** Toutes les requêtes suivantes nécessitent un token JWT dans le header `Authorization: Bearer <token>`

### 3. Ajouter une métrique de santé

**Endpoint:** `POST /metrics`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body (Poids):**
```json
{
  "type": "weight",
  "value": 75,
  "measuredAt": "2026-01-29T10:00:00Z"
}
```

**Request Body (Tension artérielle):**
```json
{
  "type": "blood_pressure",
  "systolic": 120,
  "diastolic": 80,
  "measuredAt": "2026-01-29T10:00:00Z"
}
```

**Request Body (Glucose):**
```json
{
  "type": "glucose",
  "value": 95,
  "measuredAt": "2026-01-29T10:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "7ae4430f-51a4-4cb5-a017-7d0a75149c86",
    "userId": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
    "type": "weight",
    "value": 75,
    "measuredAt": "2026-01-29T10:00:00.000Z",
    "createdAt": "2026-01-29T11:03:00.793Z",
    "updatedAt": "2026-01-29T11:03:00.793Z"
  }
}
```

**Erreurs possibles:**
- `400` : Données invalides (valeur négative, type inconnu)
- `401` : Token manquant ou invalide
- `500` : Erreur serveur

---

### 4. Récupérer toutes les métriques de l'utilisateur

**Endpoint:** `GET /metrics`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "c199ea62-b1e0-4ed2-b627-948ba51f16f3",
      "userId": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
      "type": "weight",
      "value": 73,
      "measuredAt": "2026-01-29T12:00:00.000Z",
      "createdAt": "2026-01-29T11:03:03.416Z",
      "updatedAt": "2026-01-29T11:03:03.416Z"
    },
    {
      "id": "7ae4430f-51a4-4cb5-a017-7d0a75149c86",
      "userId": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
      "type": "weight",
      "value": 75,
      "measuredAt": "2026-01-29T11:00:00.000Z",
      "createdAt": "2026-01-29T11:03:00.793Z",
      "updatedAt": "2026-01-29T11:03:00.793Z"
    }
  ]
}
```

---

### 5. Supprimer une métrique

**Endpoint:** `DELETE /metrics/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Metric deleted successfully"
}
```

**Erreurs possibles:**
- `403` : Vous ne pouvez supprimer que vos propres métriques
- `404` : Métrique non trouvée
- `401` : Token manquant ou invalide

---

## 📈 Analytics & Insights (V2)

### 6. Obtenir les analyses de santé

**Endpoint:** `GET /metrics/insights`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "type": "weight",
    "average": 74,
    "trend": "decreasing",
    "deltaPercentage": -2.67,
    "message": "Your weight trend is down by 2.67%"
  },
  {
    "type": "blood_pressure",
    "average": 0,
    "trend": "unknown",
    "message": "No data available for blood_pressure"
  },
  {
    "type": "glucose",
    "average": 0,
    "trend": "unknown",
    "message": "No data available for glucose"
  }
]
```

**Valeurs possibles pour `trend`:**
- `"increasing"` : Tendance à la hausse
- `"decreasing"` : Tendance à la baisse
- `"stable"` : Stable (variation < 1%)
- `"unknown"` : Pas assez de données

---

### 7. Exporter le rapport de santé en PDF

**Endpoint:** `GET /metrics/export`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename=health_report_<userId>.pdf`
- **Body:** Fichier PDF binaire

**Utilisation en React Native:**
```javascript
const downloadPDF = async (token) => {
  const response = await fetch('http://13.39.19.215/metrics/export', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  // Utiliser react-native-fs ou expo-file-system pour sauvegarder
};
```

---

## ⏰ Rappels de Santé (V2)

### 8. Créer un rappel

**Endpoint:** `POST /reminders`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "metricType": "weight",
  "cronSchedule": "0 9 * * *"
}
```

**Exemples de cron:**
- `"0 9 * * *"` : Tous les jours à 9h00
- `"0 12 * * 1"` : Tous les lundis à 12h00
- `"0 8 * * 1,3,5"` : Lundi, Mercredi, Vendredi à 8h00

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "reminder-uuid",
    "userId": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
    "metricType": "weight",
    "cronSchedule": "0 9 * * *",
    "isEnabled": true,
    "createdAt": "2026-01-29T11:05:00.000Z",
    "updatedAt": "2026-01-29T11:05:00.000Z"
  }
}
```

---

### 9. Récupérer tous les rappels

**Endpoint:** `GET /reminders`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "reminder-uuid",
      "userId": "a606dc40-4cc3-4c65-be92-1f0f4ee87195",
      "metricType": "weight",
      "cronSchedule": "0 9 * * *",
      "isEnabled": true,
      "createdAt": "2026-01-29T11:05:00.000Z",
      "updatedAt": "2026-01-29T11:05:00.000Z"
    }
  ]
}
```

---

### 10. Activer/Désactiver un rappel

**Endpoint:** `PATCH /reminders/:id/toggle`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "reminder-uuid",
    "isEnabled": false
  }
}
```

---

### 11. Supprimer un rappel

**Endpoint:** `DELETE /reminders/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Reminder deleted successfully"
}
```

---

## 🏥 Health Check

### 12. Vérifier l'état du serveur

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

## 🔧 Gestion des Erreurs

Toutes les erreurs suivent le même format :

```json
{
  "status": "error",
  "message": "Description de l'erreur"
}
```

**Codes HTTP courants:**
- `200` : Succès
- `201` : Ressource créée
- `400` : Requête invalide (validation échouée)
- `401` : Non authentifié (token manquant/invalide)
- `403` : Interdit (pas les permissions)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

---

## 📱 Exemple d'implémentation React Native

### Configuration Axios

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://13.39.19.215';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Exemples d'utilisation

```javascript
// Inscription
const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('authToken', token);
    return user;
  } catch (error) {
    console.error('Registration error:', error.response?.data);
    throw error;
  }
};

// Ajouter une métrique
const addMetric = async (type, value, measuredAt) => {
  try {
    const response = await api.post('/metrics', {
      type,
      value,
      measuredAt,
    });
    return response.data.data;
  } catch (error) {
    console.error('Add metric error:', error.response?.data);
    throw error;
  }
};

// Récupérer les insights
const getInsights = async () => {
  try {
    const response = await api.get('/metrics/insights');
    return response.data;
  } catch (error) {
    console.error('Get insights error:', error.response?.data);
    throw error;
  }
};

// Créer un rappel
const createReminder = async (metricType, cronSchedule) => {
  try {
    const response = await api.post('/reminders', {
      metricType,
      cronSchedule,
    });
    return response.data.data;
  } catch (error) {
    console.error('Create reminder error:', error.response?.data);
    throw error;
  }
};
```

---

## 🎯 Bonnes Pratiques

1. **Stockage du Token:** Utilisez `AsyncStorage` ou `SecureStore` (Expo) pour stocker le JWT de manière sécurisée.

2. **Gestion des erreurs:** Toujours wrapper vos appels API dans des `try/catch` et afficher des messages utilisateur appropriés.

3. **Refresh Token:** Le token expire après 24h. Implémentez une logique de reconnexion automatique.

4. **Validation côté client:** Validez les données avant de les envoyer (email valide, mot de passe fort, valeurs positives).

5. **Dates:** Utilisez toujours le format ISO 8601 pour les dates (`YYYY-MM-DDTHH:mm:ssZ`).

6. **Loading States:** Affichez des indicateurs de chargement pendant les requêtes réseau.

7. **Offline Support:** Considérez l'utilisation de `@react-native-async-storage` pour mettre en cache les données localement.

---

## 📞 Support

Pour toute question ou problème, contactez l'équipe backend ou consultez la documentation complète dans le repository GitHub.
