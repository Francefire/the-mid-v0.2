import { tablesDB } from "../appwrite";
import { Query } from "appwrite";
import { config } from "../config";

export const rooms = {
  createRoom: async (room) => {
    return await tablesDB.createRow({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
      rowId: room.$id,
      data: room,
    });
  },
  listRooms: async () => {
    return await tablesDB.listRows({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
    });
  },
  getRoom: async (roomId) => {
    return await tablesDB.listRows({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
  },
  getHand: async (roomId, userId) => {
    return await tablesDB.listRows({
      databaseId: config.appwrite.databaseId,
      tableId: "hands",
      queries: [Query.equal("roomId", roomId), Query.equal("userId", userId)],
    });
  },
  // Met à jour la main d'un joueur lorsqu'il joue une carte, l'ajoute dans son historique de carte jouée et met à jour la dernière carte jouée dans la room
  playCard: async (id, newHand, card, roomId) => {
    const response = await tablesDB.updateRow({
      databaseId: config.appwrite.databaseId,
      tableId: "hands",
      rowId: id,
      data: { cards: newHand.cards, cardsPlayed: [...(newHand.cardsPlayed || []), card] },
    });
    if (response) {
      const res = await tablesDB.updateRow({
        databaseId: config.appwrite.databaseId,
        tableId: "rooms",
        rowId: roomId,
        data: { lastPlayed: card },
      });
      return res;
    } else {
      return false;
    }
  },
  joinRoom: async (roomId, userId) => {
    // Récupérer la room actuelle
    const roomData = await tablesDB.listRows({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
    
    if (!roomData.rows || roomData.rows.length === 0) {
      throw new Error("Room non trouvée");
    }
    
    const room = roomData.rows[0];
    
    // Vérifier si l'utilisateur n'est pas déjà dans la room
    if (room.playerIds && room.playerIds.includes(userId)) {
      return room; // Déjà dans la room
    }
    
    // Vérifier si la room est pleine
    if (room.playerIds && room.playerIds.length >= room.maxPlayers) {
      throw new Error("Room pleine");
    }
    
    // Ajouter l'utilisateur à la room
    const updatedPlayerIds = [...(room.playerIds || []), userId];
    
    return await tablesDB.updateRow({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
      rowId: roomId,
      data: { playerIds: updatedPlayerIds },
    });
  },
  deleteRoom: async (roomId) => {
    return await tablesDB.deleteRow({
      databaseId: config.appwrite.databaseId,
      tableId: "rooms",
      rowId: roomId,
    });
  },
};
