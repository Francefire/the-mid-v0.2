// Runtime config that works in both dev and production
export const config = {
  appwrite: {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || "__VITE_APPWRITE_ENDPOINT__",
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "__VITE_APPWRITE_PROJECT_ID__",
    projectName: import.meta.env.VITE_APPWRITE_PROJECT_NAME || "__VITE_APPWRITE_PROJECT_NAME__",
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID || "__VITE_APPWRITE_DB_ID__"
  }
};
