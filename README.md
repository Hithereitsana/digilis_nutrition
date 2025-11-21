# Digilis Nutrition - Système d'inscription

## 📋 Fonctionnalités

- Formulaire d'inscription avec les champs suivants :
  - Nom (obligatoire)
  - Prénom (obligatoire)
  - Email (obligatoire)
  - Statut étudiant (case à cocher)
  - Nom de la licence (si étudiant)

## 💾 Stockage des données

Les inscriptions sont stockées dans le **localStorage** du navigateur. Cela signifie que :
- Les données sont sauvegardées automatiquement lors de l'inscription
- Les données persistent même après fermeture du navigateur
- Chaque navigateur/appareil a ses propres données

## 🚀 Utilisation

### Pour les étudiants

1. Ouvrir le site : https://digilis-nutrition-conference.netlify.app
2. Aller à la section "Inscription"
3. Remplir le formulaire
4. Cliquer sur "S'inscrire"

### Pour consulter les inscriptions

1. Ouvrir la page d'administration : https://digilis-nutrition-conference.netlify.app/admin.html
2. La page affiche automatiquement toutes les inscriptions du navigateur
3. Options disponibles :
   - **Afficher le tableau** : Vue tabulaire des inscriptions
   - **Afficher le JSON** : Vue JSON brute
   - **Télécharger le JSON** : Télécharger un fichier JSON avec toutes les inscriptions
   - **Copier le JSON** : Copier les données dans le presse-papier
   - **Importer depuis fichier** : Importer des inscriptions depuis un fichier JSON

## 📁 Structure des fichiers

- `index.html` : Page principale avec le formulaire d'inscription
- `inscription.js` : Gestion du formulaire et sauvegarde dans localStorage
- `admin.html` : Page d'administration pour consulter les inscriptions
- `inscriptions.json` : Fichier exemple (peut être rempli manuellement ou via export)

## ⚠️ Notes importantes

- Les données sont stockées **localement dans chaque navigateur**
- Pour partager les inscriptions entre différents appareils, utilisez la fonction "Télécharger le JSON" et partagez le fichier
- Pour fusionner des inscriptions de plusieurs sources, utilisez "Importer depuis fichier"
- Le système vérifie automatiquement les doublons (basé sur l'email)

## 🔒 Sécurité

- Les données sont stockées uniquement côté client (localStorage)
- Aucune donnée n'est envoyée à un serveur externe
- La page d'administration est accessible à tous (pensez à la protéger si nécessaire)
