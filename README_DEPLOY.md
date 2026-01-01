# Déploiement sur Vercel

Le projet est maintenant configuré pour être déployé facilement sur Vercel.

## 1. Structure
- **Racine** : Application React (Frontend)
- **/api** : Application Flask (Backend Serverless)

## 2. Étapes de déploiement (Sans commande locale)
Comme vous n'avez pas Node.js/Vercel CLI installé, la méthode la plus simple est via GitHub.

1.  **Poussez ce dossier sur GitHub** (créez un nouveau repository).
2.  **Connectez-vous à [Vercel](https://vercel.com/)**.
3.  Cliquez sur **"Add New..."** -> **"Project"**.
4.  Importez votre repository GitHub.
5.  **Configuration du projet** :
    *   **Framework Preset** : Vite (devrait être détecté automatiquement).
    *   **Root Directory** : `.` (laisser vide).
    *   **Environment Variables** (Optionnel pour l'instant) :
        *   `GEMINI_API_KEY` : Votre clé API.
6.  Cliquez sur **Deploy**.

## 3. Base de données
⚠️ **Attention** : Par défaut, l'application utilise SQLite (`familybudget.db`).
Sur Vercel, le système de fichiers est **éphémère**. Cela signifie que **vos données seront effacées** à chaque redémarrage ou nouveau déploiement.

Pour une vraie persistance, il faudra connecter une base de données externe (ex: Vercel Postgres, Supabase, Neon) et ajouter l'URL dans les variables d'environnement (`DATABASE_URL`).
