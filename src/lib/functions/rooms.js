import { tablesDB } from "../appwrite";
import { Query } from "appwrite";

export const rooms = {
  createRoom: async (room) => {
    return await tablesDB.createRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      rowId: room.$id,
      data: room,
    });
  },
  listRooms: async () => {
    return await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
    });
  },
  getRoom: async (roomId) => {
    return await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "rooms",
      queries: [Query.equal("$id", roomId)],
    });
  },
  getHand: async (roomId, userId) => {
    return await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "hands",
      queries: [Query.equal("roomId", roomId), Query.equal("userId", userId)],
    });
  },
  playCard: async (id, newHand, card, roomId) => {
    const response = await tablesDB.updateRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "hands",
      rowId: id,
      data: { cards: newHand.cards },
    });
    if (response) {
      const res = await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: "rooms",
        rowId: roomId,
        data: { lastPlayed: card },
      });
      return res;
    } else {
      return false;
    }
  },
};
