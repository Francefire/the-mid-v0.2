# Tests de la logique du jeu The Mind

## 🧪 Plan de test manuel

### Étape 1 : Vérifier la création de room

1. Aller sur la page de création de room
2. Créer une room "Test Mind" avec 4 joueurs max
3. ✅ Vérifier dans Appwrite que la room contient :
   ```json
   {
     "name": "Test Mind",
     "maxPlayers": 4,
     "creatorId": "<votre-user-id>",
     "gameStatus": "waiting",
     "currentLevel": 1,
     "playerIds": ["<votre-user-id>"],
     "livesRemaining": 0,
     "throwingStars": 0
   }
   ```

---

### Étape 2 : Rejoindre la room

1. Ouvrir la room créée
2. ✅ Vérifier que vous voyez :
   - Badge "En attente"
   - "Joueurs (1/4)"
   - Votre nom avec 👑 (créateur)
   - Bouton "🎮 Démarrer la partie" (grisé si seul)

3. Avec un 2e navigateur/compte, rejoindre la même room
4. ✅ Vérifier que les deux navigateurs affichent "Joueurs (2/4)"
5. ✅ Le bouton "Démarrer" devient actif pour le créateur

---

### Étape 3 : Démarrer la partie avec 2 joueurs

1. Cliquer sur "Démarrer la partie"
2. ✅ Vérifier dans l'UI :
   - Badge "En cours"
   - "Niveau: 1/12"
   - "Vies: ❤️ 2" (2 joueurs = 2 vies)
   - "Étoiles: ⭐ 1"
   - Chaque joueur voit **1 carte** dans sa main

3. ✅ Vérifier dans Appwrite table `rooms` :
   ```json
   {
     "gameStatus": "playing",
     "currentLevel": 1,
     "livesRemaining": 2,
     "throwingStars": 1
   }
   ```

4. ✅ Vérifier dans Appwrite table `hands` :
   - 2 documents créés (1 par joueur)
   - Chaque document a 1 carte (number entre 1-100)
   - Les 2 cartes sont différentes

---

### Étape 4 : Jouer les cartes du niveau 1

1. Le joueur avec la **plus petite carte** la joue en premier
2. ✅ Vérifier :
   - La carte disparaît de sa main
   - "Dernière carte jouée" affiche la carte
   - Les deux joueurs voient la mise à jour en temps réel

3. Le 2e joueur joue sa carte
4. ✅ Vérifier :
   - **Passage automatique au niveau 2** après ~500ms
   - "Niveau: 2/12"
   - Chaque joueur reçoit **2 nouvelles cartes**

---

### Étape 5 : Vérifier les étoiles (niveau 3)

1. Terminer le niveau 2 (jouer les 4 cartes dans l'ordre)
2. ✅ Le jeu passe au niveau 3
3. ✅ **Aucune étoile supplémentaire** (2 joueurs = étoile tous les 3 niveaux)
4. ✅ "Étoiles: ⭐ 1"

5. Terminer le niveau 3
6. ✅ **+1 étoile !** (niveau 3 avec 2 joueurs)
7. ✅ "Étoiles: ⭐ 2"

---

### Étape 6 : Recommencer avec 4 joueurs

1. Créer une nouvelle room avec 4 joueurs
2. Rejoindre avec 4 comptes différents
3. Démarrer la partie
4. ✅ Vérifier :
   - "Vies: ❤️ 3" (3-4 joueurs = 3 vies)
   - "Étoiles: ⭐ 1"

5. Terminer le niveau 1 → Niveau 2
6. ✅ **+1 étoile !** (3+ joueurs = étoile tous les 2 niveaux)
7. ✅ "Étoiles: ⭐ 2"

---

### Étape 7 : Tester la perte de vie (manuel)

**Note** : La validation de l'ordre des cartes n'est pas encore active dans l'UI, donc ce test nécessite d'appeler manuellement la fonction.

Dans la console du navigateur :
```javascript
import { game } from '@/lib/functions/game';

// Simuler une perte de vie
const result = await game.loseLife('<room-id>');
console.log(result);
// { success: true, livesRemaining: 1, gameLost: false }
```

✅ Vérifier que les vies diminuent dans l'UI en temps réel.

---

### Étape 8 : Tester l'utilisation d'une étoile (manuel)

Dans la console :
```javascript
const result = await game.useThrowingStar('<room-id>');
console.log(result);
// { success: true, starsRemaining: 0, cardsDiscarded: [5, 12, 23, 7] }
```

✅ Vérifier que :
- Les cartes les plus basses de chaque main sont retirées
- Les étoiles diminuent
- Les mains sont mises à jour en temps réel

---

### Étape 9 : Tester la victoire (niveau 12)

**Note** : Pour tester rapidement, modifier temporairement `game.js` :

```javascript
// Dans startNewLevel(), changer :
if (newLevel > 12) {  // ← Original
// En :
if (newLevel > 2) {   // ← Test rapide (victoire au niveau 3)
```

1. Jouer 2 niveaux
2. ✅ Vérifier :
   - Badge "Gagné !"
   - Message "🎉 Félicitations ! Vous avez gagné !"
   - `gameStatus = 'won'` dans Appwrite

---

### Étape 10 : Tester la défaite (0 vies)

Dans la console :
```javascript
// Perdre toutes les vies
await game.loseLife('<room-id>');
await game.loseLife('<room-id>');
// Si 3 vies :
await game.loseLife('<room-id>');
```

✅ Vérifier :
- Badge "Perdu"
- Message "💔 Partie terminée - Vous avez perdu"
- `gameStatus = 'lost'` dans Appwrite
- Impossible de jouer des cartes

---

## 📊 Résumé des cas de test

| Test | Critère | Résultat |
|------|---------|----------|
| Création de room | Champs initialisés correctement | ⬜ |
| Auto-join créateur | `playerIds` contient le créateur | ⬜ |
| Join d'autres joueurs | `playerIds` mis à jour en temps réel | ⬜ |
| Bouton démarrer | Visible uniquement pour créateur, actif si ≥2 joueurs | ⬜ |
| Vies (2 joueurs) | 2 vies | ⬜ |
| Vies (3-4 joueurs) | 3 vies | ⬜ |
| Vies (5+ joueurs) | 4 vies | ⬜ |
| Distribution niveau 1 | 1 carte par joueur | ⬜ |
| Distribution niveau N | N cartes par joueur | ⬜ |
| Cartes uniques | Aucune carte en double entre joueurs | ⬜ |
| Cartes triées dans l'UI | Ordre croissant | ⬜ |
| Jouer une carte | Retirée de la main + lastPlayed mis à jour | ⬜ |
| Fin de niveau auto | Passage au niveau suivant quand toutes cartes jouées | ⬜ |
| Étoiles (2 joueurs) | +1 aux niveaux 3, 6, 9, 12 | ⬜ |
| Étoiles (3+ joueurs) | +1 aux niveaux 2, 4, 6, 8, 10, 12 | ⬜ |
| Victoire (niveau 12) | `gameStatus = 'won'` | ⬜ |
| Défaite (0 vies) | `gameStatus = 'lost'` | ⬜ |
| Synchronisation temps réel | Tous les joueurs voient les mêmes infos | ⬜ |

---

## 🐛 Débogage

### La room ne se charge pas

1. Vérifier que l'URL contient l'ID correct : `/room/<room-id>`
2. Vérifier dans la console s'il y a des erreurs Appwrite
3. Vérifier les permissions de la table `rooms` (Read = Any)

### Les cartes ne se distribuent pas

1. Ouvrir la console du navigateur
2. Chercher des erreurs dans `initializeGame()` ou `distributeCards()`
3. Vérifier que `playerIds` est un array non vide
4. Vérifier les permissions de la table `hands` (Create = Users)

### Les joueurs ne voient pas les mêmes infos

1. Vérifier que les subscriptions Appwrite sont actives :
   ```javascript
   console.log('Subscribed to:', channel);
   ```
2. Vérifier que `VITE_APPWRITE_DB_ID` est correct dans `.env`
3. Vérifier les permissions de lecture des tables

### Niveau ne passe pas automatiquement

1. Vérifier que `checkLevelCompletion()` est appelée dans `updateHand()`
2. Augmenter le délai de 500ms à 1000ms si nécessaire
3. Vérifier dans Appwrite que toutes les mains ont `cards: []`

---

## ✅ Checklist de déploiement

Avant de considérer la fonctionnalité terminée :

- [ ] Tous les tests manuels passent
- [ ] Permissions Appwrite configurées correctement
- [ ] Variables d'environnement configurées
- [ ] Synchronisation temps réel fonctionne
- [ ] Interface responsive (mobile + desktop)
- [ ] Messages d'erreur clairs pour l'utilisateur
- [ ] Documentation à jour (GAME_ARCHITECTURE.md)
- [ ] Code commenté et lisible

---

## 🚀 Prochaines fonctionnalités à tester

Une fois les tests de base validés, passer à :

1. ✨ **Validation de l'ordre des cartes**
   - Empêcher de jouer une carte si elle est trop petite
   - Faire perdre une vie automatiquement

2. ✨ **Bouton "Utiliser une étoile"**
   - Ajouter un bouton dans l'UI
   - Afficher les cartes défaussées avec animation

3. ✨ **Système de signaux**
   - Permettre aux joueurs de communiquer sans parler
   - Gestes : "Je suis prêt", "J'ai une petite carte", etc.

4. ✨ **Historique des parties**
   - Sauvegarder les résultats dans une table `games`
   - Afficher statistiques et classements
