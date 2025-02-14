# EasyMarket Dépenses - Frontend

## 📱 Description
EasyMarket Dépenses est une application mobile développée avec React Native qui permet la gestion complète des dépenses d'une entreprise. Elle offre une interface intuitive pour l'ajout, la modification, la suppression et le suivi des dépenses, avec la possibilité de joindre des pièces justificatives.

## 🚀 Fonctionnalités principales

### 📊 Gestion des modules
- Navigation entre différents modules (Promos, Vendeurs, Dépenses)
- Interface principale avec grille de modules  
- Menu de navigation fixe en bas de l'écran

### 💰 Gestion des dépenses
- Liste complète des dépenses avec recherche
- Ajout de nouvelles dépenses
- Modification des dépenses existantes 
- Suppression des dépenses
- Catégorisation des dépenses (SALAIRE, EAU, ELECTRICITE, etc.)
- Support pour les types de dépenses personnalisés

### 💳 Moyens de paiement
- WAVE
- ORANGE MONEY
- FREE MONEY
- CASH

### 📄 Pièces justificatives
- Upload de documents (images et PDF)
- Prévisualisation des documents
- Partage de documents
- Gestion des pièces jointes

## 🛠 Technologies utilisées

### Framework principal
- React Native
- Expo

### État et Navigation
- Redux Toolkit (gestion d'état)
- React Navigation (navigation entre écrans)

### Composants et UI
- @react-native-picker/picker
- expo-document-picker
- expo-file-system
- expo-sharing
- @expo/vector-icons

## 📁 Structure du projet
EasymarketDepense_frontend/
├── App.js                          # Point d'entrée de l'application
├── screens/                        # Écrans de l'application
│   ├── Modules.js                  # Écran d'accueil avec grille de modules
│   ├── Depenses.js                 # Liste des dépenses
│   ├── AjoutDepenses.js            # Formulaire d'ajout de dépense
│   └── DetailDepenses.js           # Vue détaillée et modification
├── components/                     # Composants réutilisables
│   └── Footer.js                   # Barre de navigation commune
├── src/                            # Code source
│   ├── redux/                      # Configuration Redux
│   │   ├── store.js
│   │   └── features/
│   │       └── depenses/
│   │           └── depensesSlice.js
│   └── services/                   # Services API
│       └── api.js
└── assets/                         # Images et ressources

## 🔄 Flux de données

1. **État global (Redux)**
   - Gestion centralisée des dépenses
   - Actions asynchrones pour les opérations CRUD
   - État de chargement et gestion des erreurs

2. **API Interactions**
   - Communication avec le backend Django
   - Gestion des requêtes multipart pour les fichiers
   - Traitement des réponses et erreurs

3. **Navigation**
   - Stack Navigator pour la navigation principale
   - Passage de paramètres entre écrans
   - Footer pour la navigation rapide

## 🚀 Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du projet
expo start

# Lancement sur iOS
expo run:ios

# Lancement sur Android
expo run:android
```

## 🔧 Configuration requise
- Node.js >= 14.0.0
- Expo CLI
- iOS 13+ ou Android 6.0+

## 📝 Notes
- L'application nécessite une connexion au backend Django stocké sur les serveurs de Render

## 👥 Équipe
Cheikh Ahmed Tidiane Gueye

---
Développé avec ❤️ pour EasyMarket
