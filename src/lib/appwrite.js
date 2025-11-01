import { Client, Account, TablesDB } from "appwrite";
export const client = new Client();

client
  .setEndpoint("__VITE_APPWRITE_ENDPOINT__")
  .setProject("__VITE_APPWRITE_PROJECT_ID__");

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
