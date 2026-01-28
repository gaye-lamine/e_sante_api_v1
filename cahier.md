Cahier des charges – Backend Suivi Santé (MVP Final)
1️⃣ Objectif du projet

Créer un backend Node.js + TypeScript pour une application de suivi santé simple et gratuit au Sénégal permettant aux utilisateurs de :

Enregistrer leurs mesures de santé (poids, tension, glycémie)

Consulter un historique de leurs mesures

Contraintes :

MVP simple et testable rapidement

Architecture Clean Architecture, logique feature-based

Prévoir l’évolution vers une base de données réelle (PostgreSQL / Supabase)

2️⃣ Public cible

Utilisateurs sénégalais intéressés par le suivi de leur santé

Pas nécessairement technophiles

Usage personnel (chaque utilisateur voit uniquement ses propres données)

3️⃣ Fonctionnalités backend
3.1 Authentification / utilisateur

Inscription : email + mot de passe

Connexion : JWT ou session pour sécuriser les endpoints

Gestion utilisateur : possibilité de récupérer ou modifier son profil

3.2 Gestion des mesures santé (health_metrics)

Ajouter une mesure : poids, tension, glycémie

Récupérer les mesures : historique complet ou filtré par type/date

Supprimer une mesure

Règles de validation :

Poids > 0 kg

Tension : systolique et diastolique > 0

Glycémie > 0 mg/dL

3.3 Sécurité

Chaque utilisateur ne voit que ses propres mesures

Validation et sanitation des entrées

3.4 Notifications / Rappels

Prévoir la structure pour envoyer des notifications à des dates programmées

4️⃣ Architecture backend

Domain : entités User, HealthMetric, règles de validation

Application : services / cas d’usage (addMetric, getMetrics, registerUser, loginUser)

Infrastructure : repository pour DB, stockage, email (in-memory pour MVP, Supabase/PostgreSQL plus tard)

Presentation : API REST avec Express.js ou Nest.js

5️⃣ Modélisation des données (MVP)
Table : users
Champ	Type	Description
id	UUID	Identifiant unique
name	string	Nom complet
email	string	Email unique
password_hash	string	Hash du mot de passe
created_at	timestamp	Date de création
updated_at	timestamp	Date de dernière modification
Table : health_metrics
Champ	Type	Description
id	UUID	Identifiant unique
user_id	UUID	Référence à l’utilisateur
type	enum	"weight", "blood_pressure", "glucose"
value	number	Poids ou glycémie
systolic	number	Pour tension systolique
diastolic	number	Pour tension diastolique
measured_at	timestamp	Date et heure de la mesure
created_at	timestamp	Date d’enregistrement
updated_at	timestamp	Date de modification
6️⃣ Endpoints API (REST – MVP)
Méthode	Endpoint	Description	Body / Query Params
POST	/auth/register	Créer un compte utilisateur	name, email, password
POST	/auth/login	Connexion utilisateur	email, password
POST	/metrics	Ajouter une mesure santé	userId, type, value/systolic/diastolic, measuredAt
GET	/metrics/:userId	Récupérer toutes les mesures	-
DELETE	/metrics/:id	Supprimer une mesure	-
7️⃣ Priorité pour MVP

Authentification + JWT

CRUD mesures santé (ajout + consultation)

Validation stricte des données

Architecture Clean Architecture, feature-based

Infrastructure in-memory (migrable vers Supabase / PostgreSQL)