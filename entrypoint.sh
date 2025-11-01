#!/bin/sh

# Replace env vars in JavaScript files at runtime
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
  -e "s|__VITE_APPWRITE_PROJECT_ID__|${VITE_APPWRITE_PROJECT_ID}|g" \
  -e "s|__VITE_APPWRITE_PROJECT_NAME__|${VITE_APPWRITE_PROJECT_NAME}|g" \
  -e "s|__VITE_APPWRITE_ENDPOINT__|${VITE_APPWRITE_ENDPOINT}|g" \
  -e "s|__VITE_APPWRITE_DB_ID__|${VITE_APPWRITE_DB_ID}|g" \
  {} +

# Start nginx
exec nginx -g 'daemon off;'
