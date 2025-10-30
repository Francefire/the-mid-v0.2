import { tablesDB } from "../appwrite";
import { Query, ID } from "appwrite";

/**
 * Calcule le nombre de vies initial selon les règles officielles de The Mind
 * @param {number} playerCount - Nombre de joueurs (2-10)
 * @returns {number} - Nombre de vies
 */
export const calculateInitialLives = (playerCount) => {
  if (playerCount === 2) return 2;
  if (playerCount >= 3 && playerCount <= 4) return 3;
  return 4; // 5+ joueurs
};

/**
 * Calcule le nombre d'étoiles ninja initial selon les règles officielles
 * @param {number} playerCount - Nombre de joueurs (2-10)
 * @returns {number} - Nombre d'étoiles ninja
 */
export const calculateInitialStars = (playerCount) => {
  if (playerCount === 2) return 1;
  return 1; // Tous les joueurs commencent avec 1 étoile
};

/**
 * Génère et mélange un jeu de 100 cartes
 * @returns {number[]} - Tableau de 100 nombres mélangés (1-100)
 */
export const shuffleDeck = () => {
  // Créer un tableau de 1 à 100
  const deck = Array.from({ length: 100 }, (_, i) => i + 1);
  
  // Algorithme de Fisher-Yates pour mélanger
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

/**
 * Distribue les cartes aux joueurs pour un niveau donné
 * @param {string} roomId - ID de la room
 * @param {string[]} playerIds - Tableau des IDs des joueurs
 * @param {number} level - Niveau actuel (1-12)
 * @returns {Promise<Object>} - Résultat de la distribution
 */
export const distributeCards = async (roomId, playerIds, level) => {
  try {
    // Mélanger le deck
    const deck = shuffleDeck();
    
    // Calculer le nombre total de cartes nécessaires
    const cardsPerPlayer = level;
    const totalCardsNeeded = playerIds.length * cardsPerPlayer;
    
    if (totalCardsNeeded > 100) {
      throw new Error(`Trop de cartes nécessaires pour le niveau ${level} avec ${playerIds.length} joueurs`);
    }
    
    // Distribuer les cartes à chaque joueur
    const distributions = [];
    for (let i = 0; i < playerIds.length; i++) {
      const startIndex = i * cardsPerPlayer;
      const endIndex = startIndex + cardsPerPlayer;
      const playerCards = deck.slice(startIndex, endIndex);
      
      // Vérifier si une main existe déjà pour ce joueur dans cette room
      const existingHands = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: "hands",
        queries: [
          Query.equal("roomId", roomId),
          Query.equal("userId", playerIds[i])
        ],
      });
      
      if (existingHands.rows && existingHands.rows.length > 0) {
        // Mettre à jour la main existante
        const updateResult = await tablesDB.updateRow({
          databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
          tableId: "hands",
          rowId: existingHands.rows[0].$id,
          data: { cards: playerCards },
        });
        distributions.push(updateResult);
      } else {
        // Créer une nouvelle main
        const createResult = await tablesDB.createRow({
          databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
          tableId: "hands",
          rowId: ID.unique(),
          data: {
            roomId: roomId,
            userId: playerIds[i],
            cards: playerCards,
          },
        });
        distributions.push(createResult);
      }
    }
    
    return {
      success: true,
      distributions,
      cardsDistributed: totalCardsNeeded,
    };
  } catch (error) {
    console.error("Erreur lors de la distribution des cartes:", error);
    throw error;
  }
};

/**
 * Initialise une nouvelle partie de The Mind
 * @param {string} roomId - ID de la room
 * @param {string[]} playerIds - Tableau des IDs des joueurs
 * @returns {Promise<Object>} - Résultat de l'initialisation
 */
export const initializeGame = async (roomId, playerIds) => {
  try {
    const playerCount = playerIds.length;
    
    // Calculer les vies et étoiles initiales
    const initialLives = calculateInitialLives(playerCount);
    const initialStars = calculateInitialStars(playerCount);
    
    // Mettre à jour la room avec l'état initial du jeu
    const roomUpdate = await tablesDB.updateRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      rowId: roomId,
      data: {
        gameStatus: "playing",
        currentLevel: 1,
        playerIds: playerIds,
        livesRemaining: initialLives,
        //throwingStars: initialStars,
        lastPlayed: null,
      },
    });
    
    // Distribuer les cartes pour le niveau 1
    await distributeCards(roomId, playerIds, 1);
    
    return {
      success: true,
      room: roomUpdate,
      initialLives,
      initialStars,
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation du jeu:", error);
    throw error;
  }
};

/**
 * Démarre un nouveau niveau (redistribue les cartes)
 * @param {string} roomId - ID de la room
 * @returns {Promise<Object>} - Résultat du nouveau niveau
 */
export const startNewLevel = async (roomId) => {
  try {
    // Récupérer les infos de la room
    const roomData = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
    
    if (!roomData.rows || roomData.rows.length === 0) {
      throw new Error("Room non trouvée");
    }
    
    const room = roomData.rows[0];
    const newLevel = room.currentLevel + 1;
    
    if (newLevel > 12) {
      // Le jeu est gagné !
      await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: "rooms",
        rowId: roomId,
        data: { gameStatus: "won" },
      });
      
      return {
        success: true,
        gameWon: true,
        level: newLevel,
      };
    }
    
    // Calculer les étoiles ninja selon les règles
    // 2 joueurs: tous les 3 niveaux (niveaux 3, 6, 9, 12)
    // 3+ joueurs: tous les 2 niveaux (niveaux 2, 4, 6, 8, 10, 12)
    let newStars = room.throwingStars;
    const playerCount = room.playerIds.length;
    
    if (playerCount === 2 && newLevel % 3 === 0) {
      newStars += 1;
    } else if (playerCount >= 3 && newLevel % 2 === 0) {
      newStars += 1;
    }
    
    // Mettre à jour le niveau et les étoiles
    await tablesDB.updateRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      rowId: roomId,
      data: {
        currentLevel: newLevel,
        //throwingStars: newStars,
        lastPlayed: null,
      },
    });
    
    // Distribuer les cartes pour le nouveau niveau
    await distributeCards(roomId, room.playerIds, newLevel);
    
    return {
      success: true,
      level: newLevel,
      starsEarned: newStars > room.throwingStars,
      totalStars: newStars,
    };
  } catch (error) {
    console.error("Erreur lors du démarrage du nouveau niveau:", error);
    throw error;
  }
};

// ============================================================================
// HOOKS D'EXTENSION POUR LES FONCTIONNALITÉS FUTURES
// ============================================================================

/**
 * [EXTENSION HOOK] Valide si une carte peut être jouée selon l'ordre
 * @param {number} lastPlayed - Dernière carte jouée dans la room (ou null)
 * @param {number} newCard - Carte que le joueur veut jouer
 * @param {number[]} allPlayerCards - Toutes les cartes restantes de tous les joueurs (pour validation avancée)
 * @returns {Promise<{valid: boolean, shouldLoseLife: boolean}>}
 * 
 * LOGIQUE À IMPLÉMENTER:
 * - Si newCard > lastPlayed (ou lastPlayed === null) : valid = true
 * - Si newCard < lastPlayed : valid = false, shouldLoseLife = true
 * - Vérifier si d'autres joueurs ont des cartes plus petites que newCard
 */
export const validateCardOrder = async (lastPlayed, newCard, allPlayerCards = []) => {
  // TODO: Implémenter la validation complète
  // Pour l'instant, validation simple
  if (lastPlayed === null || lastPlayed === undefined) {
    return { valid: true, shouldLoseLife: false };
  }
  
  if (newCard > lastPlayed) {
    return { valid: true, shouldLoseLife: false };
  }
  
  return { valid: false, shouldLoseLife: true };
};

/**
 * [EXTENSION HOOK] Fait perdre une vie à la room et vérifie si le jeu est perdu
 * @param {string} roomId - ID de la room
 * @returns {Promise<{success: boolean, livesRemaining: number, gameLost: boolean}>}
 * 
 * LOGIQUE À IMPLÉMENTER:
 * - Décrémenter livesRemaining de 1
 * - Si livesRemaining === 0 : gameStatus = "lost"
 * - Retourner l'état actuel
 * - Éventuellement: notifier tous les joueurs, afficher animation, etc.
 */
export const loseLife = async (roomId) => {
  try {
    // Récupérer les infos de la room
    const roomData = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
    
    if (!roomData.rows || roomData.rows.length === 0) {
      throw new Error("Room non trouvée");
    }
    
    const room = roomData.rows[0];
    const newLives = Math.max(0, room.livesRemaining - 1);
    const gameLost = newLives === 0;
    
    // Mettre à jour la room
    await tablesDB.updateRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      rowId: roomId,
      data: {
        livesRemaining: newLives,
        gameStatus: gameLost ? "lost" : room.gameStatus,
      },
    });
    
    return {
      success: true,
      livesRemaining: newLives,
      gameLost,
    };
  } catch (error) {
    console.error("Erreur lors de la perte de vie:", error);
    throw error;
  }
};

/**
 * [EXTENSION HOOK] Utilise une étoile ninja pour défausser les cartes les plus basses
 * @param {string} roomId - ID de la room
 * @returns {Promise<{success: boolean, starsRemaining: number, cardsDiscarded: number[]}>}
 * 
 * LOGIQUE À IMPLÉMENTER:
 * - Vérifier que throwingStars > 0
 * - Récupérer toutes les mains des joueurs
 * - Identifier la carte la plus basse de chaque joueur
 * - Retirer ces cartes des mains respectives
 * - Décrémenter throwingStars de 1
 * - Retourner les cartes défaussées pour l'affichage
 */
export const useThrowingStar = async (roomId) => {
  try {
    // Récupérer les infos de la room
    const roomData = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
    
    if (!roomData.rows || roomData.rows.length === 0) {
      throw new Error("Room non trouvée");
    }
    
    const room = roomData.rows[0];
    
    if (room.throwingStars <= 0) {
      throw new Error("Aucune étoile ninja disponible");
    }
    
    // Récupérer toutes les mains
    const handsData = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "hands",
      queries: [Query.equal("roomId", roomId)],
    });
    
    const cardsDiscarded = [];
    
    // Pour chaque main, retirer la carte la plus basse
    for (const hand of handsData.rows) {
      if (hand.cards && hand.cards.length > 0) {
        const lowestCard = Math.min(...hand.cards);
        const newCards = hand.cards.filter(card => card !== lowestCard);
        
        await tablesDB.updateRow({
          databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
          tableId: "hands",
          rowId: hand.$id,
          data: { cards: newCards },
        });
        
        cardsDiscarded.push(lowestCard);
      }
    }
    
    // Décrémenter les étoiles
    await tablesDB.updateRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      rowId: roomId,
      data: { throwingStars: room.throwingStars - 1 },
    });
    
    return {
      success: true,
      starsRemaining: room.throwingStars - 1,
      cardsDiscarded,
    };
  } catch (error) {
    console.error("Erreur lors de l'utilisation de l'étoile ninja:", error);
    throw error;
  }
};

/**
 * [EXTENSION HOOK] Vérifie si un niveau est terminé et lance le suivant
 * @param {string} roomId - ID de la room
 * @returns {Promise<{levelComplete: boolean, allCardsPlayed: boolean}>}
 * 
 * LOGIQUE À IMPLÉMENTER:
 * - Récupérer toutes les mains de la room
 * - Vérifier si toutes les cartes ont été jouées (cards.length === 0 pour tous)
 * - Si oui: appeler startNewLevel()
 * - Si non: retourner levelComplete = false
 */
export const checkLevelCompletion = async (roomId) => {
  try {
    // Récupérer toutes les mains
    const handsData = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "hands",
      queries: [Query.equal("roomId", roomId)],
    });
    
    // Vérifier si toutes les mains sont vides
    const allCardsPlayed = handsData.rows.every(
      hand => !hand.cards || hand.cards.length === 0
    );
    
    if (allCardsPlayed) {
      // Niveau terminé ! Passer au suivant
      await startNewLevel(roomId);
      return {
        levelComplete: true,
        allCardsPlayed: true,
      };
    }
    
    return {
      levelComplete: false,
      allCardsPlayed: false,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification de complétion du niveau:", error);
    throw error;
  }
};

export const game = {
  calculateInitialLives,
  calculateInitialStars,
  shuffleDeck,
  distributeCards,
  initializeGame,
  startNewLevel,
  validateCardOrder,
  loseLife,
  useThrowingStar,
  checkLevelCompletion,
};
