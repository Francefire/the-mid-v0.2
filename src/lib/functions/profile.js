import { ID, Query } from "appwrite";
import { tablesDB } from "../appwrite";

export const profile = {
  createProfile: (userInfos) => {
    const promise = tablesDB.createRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "profiles",
      rowId: userInfos.id,
      data: {
        firstName: userInfos.firstName,
        lastName: userInfos.lastName,
        birthDate: userInfos.birthDate,
        gender: userInfos.gender,
        profilePictureUrl: userInfos.profilePictureUrl,
        bio: userInfos.bio,
      },
    });
    promise.then(
      (response) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  },
  getProfile: async (userId) => {
    let response = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: "profiles",
      queries: [Query.equal("$id", userId)],
    });
    return response.rows[0];
  },
};
