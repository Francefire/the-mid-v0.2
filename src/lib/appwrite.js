import { Client, Account, TablesDB } from "appwrite";
import { config } from "./config";

export const client = new Client();

client
  .setEndpoint(config.appwrite.endpoint)
  .setProject(config.appwrite.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
