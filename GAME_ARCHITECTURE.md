# Architecture du jeu The Mind

## 📋 Vue d'ensemble

Ce document décrit l'architecture de l'implémentation du jeu **The Mind** avec la logique de distribution des cartes et les points d'extension pour les futures fonctionnalités.

---

## 🗂️ Structure des fichiers

```
src/
├── lib/
│   └── functions/
│       ├── game.js          ← Logique complète du jeu The Mind
│       ├── rooms.js          ← Gestion des rooms (CRUD + joinRoom)
│       └── profile.js        ← Gestion des profils utilisateurs
├── app/
│   ├── room.jsx             ← Interface principale du jeu
│   └── roomCreate.jsx       ← Création de room avec initialisations
└── context/
    └── authContext.jsx      ← Contexte d'authentification
```

---

## 🎮 Règles officielles de The Mind

### Cartes
- **100 cartes** numérotées de 1 à 100
- À chaque nouveau niveau, les 100 cartes sont **mélangées**

### Niveaux
- **12 niveaux** au total (le jeu peut aller jusqu'au niveau 12)
- Au **niveau N**, chaque joueur reçoit **N cartes**
- Exemple : Niveau 3 → 3 cartes par joueur

### Vies (règles officielles)
- **2 joueurs** : 2 vies
- **3-4 joueurs** : 3 vies
- **5+ joueurs** : 4 vies

### Étoiles ninja (règles officielles)
- Tous les joueurs commencent avec **1 étoile**
- **2 joueurs** : +1 étoile tous les **3 niveaux** (niveaux 3, 6, 9, 12)
- **3+ joueurs** : +1 étoile tous les **2 niveaux** (niveaux 2, 4, 6, 8, 10, 12)

### Objectif
- Jouer toutes les cartes dans l'ordre croissant
- Terminer les 12 niveaux sans perdre toutes les vies

---

## 🗄️ Schéma de base de données (Appwrite)

### Table `rooms`

| Champ             | Type     | Description                                      |
|-------------------|----------|--------------------------------------------------|
| `$id`             | string   | ID unique de la room                             |
| `name`            | string   | Nom de la room                                   |
| `maxPlayers`      | number   | Nombre maximum de joueurs (2-10)                 |
| `creatorId`       | string   | ID du créateur (peut démarrer la partie)        |
| `gameStatus`      | string   | État : `'waiting'`, `'playing'`, `'won'`, `'lost'` |
| `currentLevel`    | number   | Niveau actuel (1-12)                             |
| `playerIds`       | array    | Liste des IDs des joueurs dans la room          |
| `livesRemaining`  | number   | Nombre de vies restantes                         |
| `throwingStars`   | number   | Nombre d'étoiles ninja disponibles               |
| `lastPlayed`      | number   | Dernière carte jouée (ou null)                   |

### Table `hands`

| Champ    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `$id`    | string | ID unique de la main                 |
| `roomId` | string | ID de la room                        |
| `userId` | string | ID du joueur                         |
| `cards`  | array  | Liste des cartes du joueur (numbers) |

### Table `profiles`

| Champ              | Type   | Description              |
|--------------------|--------|--------------------------|
| `$id`              | string | ID du profil (= userId)  |
| `firstName`        | string | Prénom                   |
| `lastName`         | string | Nom                      |
| `birthDate`        | string | Date de naissance        |
| `gender`           | string | Genre                    |
| `profilePictureUrl`| string | URL de l'avatar          |
| `bio`              | string | Biographie               |

---

## 🔧 Fonctions principales (`game.js`)

### Fonctions de configuration

#### `calculateInitialLives(playerCount)`
```javascript
// Calcule les vies initiales selon les règles officielles
// 2 joueurs → 2 vies
// 3-4 joueurs → 3 vies
// 5+ joueurs → 4 vies
```

#### `calculateInitialStars(playerCount)`
```javascript
// Tous commencent avec 1 étoile
```

### Fonctions de distribution

#### `shuffleDeck()`
```javascript
// Génère un tableau [1...100] et le mélange avec Fisher-Yates
// Retourne: number[] (100 cartes mélangées)
```

#### `distributeCards(roomId, playerIds, level)`
```javascript
// Distribue les cartes pour un niveau donné
// - Mélange le deck
// - Calcule cardsPerPlayer = level
// - Crée ou met à jour les documents "hands" pour chaque joueur
// Retourne: { success, distributions, cardsDistributed }
```

#### `initializeGame(roomId, playerIds)`
```javascript
// Initialise une nouvelle partie
// 1. Calcule vies et étoiles selon playerCount
// 2. Met à jour la room avec gameStatus='playing', currentLevel=1
// 3. Appelle distributeCards() pour le niveau 1
// Retourne: { success, room, initialLives, initialStars }
```

#### `startNewLevel(roomId)`
```javascript
// Passe au niveau suivant
// 1. Incrémente currentLevel
// 2. Ajoute des étoiles si conditions remplies (tous les 2-3 niveaux)
// 3. Vérifie si niveau > 12 → gameStatus='won'
// 4. Appelle distributeCards() pour le nouveau niveau
// Retourne: { success, level, starsEarned, totalStars }
```

---

## 🎣 Hooks d'extension (points d'extension pour futures fonctionnalités)

Ces fonctions sont **déjà implémentées** avec une logique de base mais sont conçues pour être **étendues** selon vos besoins.

### `validateCardOrder(lastPlayed, newCard, allPlayerCards)`

**Objectif** : Valider si une carte peut être jouée

**Logique actuelle** :
- Si `newCard > lastPlayed` → valide
- Si `newCard < lastPlayed` → invalide, perte de vie

**Extensions possibles** :
- Vérifier si d'autres joueurs ont des cartes plus petites que `newCard`
- Bloquer le jeu jusqu'à consensus
- Afficher des animations d'erreur

**Retourne** :
```javascript
{
  valid: boolean,           // La carte peut-elle être jouée ?
  shouldLoseLife: boolean   // Faut-il perdre une vie ?
}
```

---

### `loseLife(roomId)`

**Objectif** : Retirer une vie et vérifier si le jeu est perdu

**Logique actuelle** :
- Décrémente `livesRemaining` de 1
- Si `livesRemaining === 0` → `gameStatus = 'lost'`

**Extensions possibles** :
- Afficher une animation de perte de vie
- Notifier tous les joueurs
- Logger l'événement pour statistiques

**Retourne** :
```javascript
{
  success: boolean,
  livesRemaining: number,
  gameLost: boolean
}
```

---

### `useThrowingStar(roomId)`

**Objectif** : Utiliser une étoile ninja pour défausser les cartes les plus basses

**Logique actuelle** :
- Vérifie que `throwingStars > 0`
- Pour chaque joueur, retire la carte la plus basse de sa main
- Décrémente `throwingStars` de 1

**Extensions possibles** :
- Afficher les cartes défaussées avec animation
- Demander confirmation avant utilisation
- Empêcher l'utilisation au mauvais moment

**Retourne** :
```javascript
{
  success: boolean,
  starsRemaining: number,
  cardsDiscarded: number[]  // Cartes retirées pour affichage
}
```

---

### `checkLevelCompletion(roomId)`

**Objectif** : Vérifier si toutes les cartes ont été jouées et passer au niveau suivant

**Logique actuelle** :
- Récupère toutes les mains
- Vérifie si `cards.length === 0` pour tous les joueurs
- Si oui → appelle `startNewLevel()`

**Extensions possibles** :
- Afficher un écran de transition entre niveaux
- Calculer un score/temps pour chaque niveau
- Ajouter une pause avant le niveau suivant

**Retourne** :
```javascript
{
  levelComplete: boolean,
  allCardsPlayed: boolean
}
```

**Appelée automatiquement** dans `room.jsx` après chaque carte jouée (avec un délai de 500ms).

---

## 🚀 Flux de jeu complet

### 1. Création de la room (`roomCreate.jsx`)

```javascript
const newRoom = {
  $id: ID.unique(),
  name: roomName,
  maxPlayers: parseInt(maxPlayers),
  creatorId: user.$id,           // ← Créateur
  gameStatus: "waiting",          // ← En attente
  currentLevel: 1,
  playerIds: [user.$id],          // ← Créateur auto-joint
  livesRemaining: 0,
  throwingStars: 0,
};
```

### 2. Rejoindre la room (`room.jsx`)

```javascript
useEffect(() => {
  rooms.joinRoom(id, user.$id);  // ← Auto-join
}, [id, user.$id]);
```

**Fonction `joinRoom(roomId, userId)`** :
- Vérifie que l'utilisateur n'est pas déjà dans la room
- Vérifie que la room n'est pas pleine
- Ajoute `userId` au tableau `playerIds`

### 3. Démarrage de la partie (bouton visible uniquement pour le créateur)

```javascript
const handleStartGame = async () => {
  await game.initializeGame(id, roomData.playerIds);
};
```

**Ce qui se passe** :
1. Calcule les vies et étoiles selon `playerIds.length`
2. Met à jour `gameStatus = 'playing'`, `currentLevel = 1`
3. Distribue 1 carte par joueur (niveau 1)
4. Crée/met à jour les documents dans la table `hands`

### 4. Jouer une carte

```javascript
const updateHand = (card) => {
  const newHand = { ...hand, cards: hand.cards.filter((c) => c !== card) };
  rooms.playCard(hand.$id, newHand, card, id);
  
  // Vérifier automatiquement si le niveau est terminé
  setTimeout(() => {
    game.checkLevelCompletion(id);
  }, 500);
};
```

**Ce qui se passe** :
1. Retire la carte de la main du joueur
2. Met à jour la table `hands`
3. Met à jour `lastPlayed` dans la table `rooms`
4. Vérifie si toutes les mains sont vides → passe au niveau suivant

### 5. Fin de niveau automatique

Si toutes les cartes sont jouées :
- `checkLevelCompletion()` appelle `startNewLevel()`
- `currentLevel++`
- Ajout d'étoiles si applicable
- Redistribution de `level` cartes par joueur

### 6. Victoire ou défaite

- **Victoire** : `currentLevel > 12` → `gameStatus = 'won'`
- **Défaite** : `livesRemaining === 0` → `gameStatus = 'lost'`

---

## 🔄 Synchronisation en temps réel (Appwrite Subscriptions)

Le composant `room.jsx` s'abonne aux changements de la room et des mains :

```javascript
// Écouter les changements de la room
client.subscribe(
  [`databases.${DB_ID}.tables.rooms.rows.${roomId}`],
  (response) => {
    setRoomData(response.payload);
    setLastRoomPlayedCard(response.payload.lastPlayed);
    loadPlayers(response.payload.playerIds);
  }
);

// Écouter les changements des mains
client.subscribe(
  [`databases.${DB_ID}.tables.hands.rows`],
  (response) => {
    if (response.payload.userId === user.$id && response.payload.roomId === id) {
      setHand(response.payload);
    }
  }
);
```

**Résultat** : Tous les joueurs voient les mises à jour en temps réel sans recharger la page.

---

## 🎨 Interface utilisateur (`room.jsx`)

### Écran d'attente (`gameStatus = 'waiting'`)

- **Affiche** :
  - Nom de la room
  - Liste des joueurs présents
  - Compteur `X/maxPlayers`
  
- **Si créateur** : Bouton "🎮 Démarrer la partie" (actif si ≥ 2 joueurs)
- **Sinon** : Message "En attente que l'hôte démarre la partie..."

### Écran de jeu (`gameStatus = 'playing'`)

- **Indicateurs** :
  - Niveau actuel (ex: `5/12`)
  - Vies restantes (ex: `❤️ 2`)
  - Étoiles ninja (ex: `⭐ 3`)

- **Dernière carte jouée** :
  - Grosse carte affichée au centre

- **Ma main** :
  - Cartes triées par ordre croissant
  - Clic sur une carte → la joue

### Écran de fin

- **Victoire** : Message "🎉 Félicitations ! Vous avez gagné !"
- **Défaite** : Message "💔 Partie terminée - Vous avez perdu"

---

## 🔮 Futures fonctionnalités à implémenter

### Validation avancée des cartes

Avant de jouer une carte, vérifier :
```javascript
const validation = await game.validateCardOrder(
  lastPlayed, 
  cardToPlay, 
  allPlayerCards
);

if (!validation.valid) {
  if (validation.shouldLoseLife) {
    await game.loseLife(roomId);
    alert("Erreur ! Vous avez joué une carte trop petite. Vous perdez une vie.");
  }
  return; // Empêcher de jouer la carte
}
```

### Bouton "Utiliser une étoile ninja"

```javascript
const handleUseThrowingStar = async () => {
  const result = await game.useThrowingStar(roomId);
  alert(`Étoile utilisée ! Cartes défaussées : ${result.cardsDiscarded.join(', ')}`);
};
```

Afficher dans l'UI :
```jsx
<Button onClick={handleUseThrowingStar} disabled={roomData.throwingStars === 0}>
  ⭐ Utiliser une étoile ({roomData.throwingStars} disponibles)
</Button>
```

### Système de chat ou signaux

Ajouter une table `messages` :
```javascript
{
  roomId: string,
  userId: string,
  type: 'signal' | 'chat',
  content: string,
  timestamp: Date
}
```

### Statistiques et historique

Ajouter une table `games` :
```javascript
{
  roomId: string,
  playerIds: string[],
  startTime: Date,
  endTime: Date,
  finalLevel: number,
  result: 'won' | 'lost',
  totalCardsPlayed: number
}
```

### Mode solo / entraînement

Permettre de jouer seul avec 2-4 mains virtuelles pour s'entraîner.

---

## 📝 Résumé des fichiers modifiés/créés

| Fichier                     | Action   | Description                                      |
|-----------------------------|----------|--------------------------------------------------|
| `src/lib/functions/game.js` | ✅ Créé  | Logique complète du jeu (distribution, niveaux, hooks) |
| `src/lib/functions/rooms.js`| ✅ Modifié | Ajout de `joinRoom()`                          |
| `src/app/roomCreate.jsx`    | ✅ Modifié | Initialisation des champs du jeu               |
| `src/app/room.jsx`          | ✅ Modifié | Interface complète (attente, jeu, fin)         |

---

## 🧪 Tests suggérés

1. **Créer une room** → Vérifier que `gameStatus = 'waiting'`
2. **Rejoindre une room** → Vérifier que `playerIds` est mis à jour
3. **Démarrer avec 2 joueurs** → Vérifier 2 vies, 1 étoile, 1 carte chacun
4. **Démarrer avec 4 joueurs** → Vérifier 3 vies, 1 étoile, 1 carte chacun
5. **Jouer toutes les cartes niveau 1** → Vérifier passage au niveau 2 (2 cartes chacun)
6. **Niveau 3 avec 2 joueurs** → Vérifier +1 étoile
7. **Niveau 2 avec 4 joueurs** → Vérifier +1 étoile
8. **Perdre toutes les vies** → Vérifier `gameStatus = 'lost'`
9. **Terminer niveau 12** → Vérifier `gameStatus = 'won'`

---

## 🛠️ Configuration Appwrite nécessaire

### Permissions de la table `rooms`

- **Create** : Utilisateurs authentifiés
- **Read** : Tous (pour lister les rooms)
- **Update** : Créateur de la room + membres
- **Delete** : Créateur uniquement

### Permissions de la table `hands`

- **Create** : Système (via fonction game.js)
- **Read** : Propriétaire de la main uniquement
- **Update** : Propriétaire uniquement
- **Delete** : Système

### Index recommandés

- `rooms.playerIds` (array)
- `hands.roomId` + `hands.userId` (compound)

---

## ✅ Conclusion

L'architecture est maintenant **complète et extensible** :

✅ Distribution automatique selon les règles officielles  
✅ Gestion des niveaux (1-12)  
✅ Vies et étoiles ninja calculées correctement  
✅ Interface complète (attente, jeu, victoire/défaite)  
✅ Synchronisation en temps réel  
✅ Hooks d'extension pour validation, étoiles, etc.  

**Prochaines étapes** :
1. Tester le flow complet
2. Ajouter la validation de l'ordre des cartes
3. Implémenter l'utilisation des étoiles ninja
4. Ajouter des animations et effets visuels
