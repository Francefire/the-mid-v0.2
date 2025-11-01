#!/bin/sh

echo "🚀 Starting entrypoint script..."
echo "📝 Environment variables:"
echo "   VITE_APPWRITE_ENDPOINT: ${VITE_APPWRITE_ENDPOINT}"
echo "   VITE_APPWRITE_PROJECT_ID: ${VITE_APPWRITE_PROJECT_ID}"
echo "   VITE_APPWRITE_DB_ID: ${VITE_APPWRITE_DB_ID}"

# Replace env vars in JavaScript files at runtime
echo "🔄 Replacing placeholders in JS files..."
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i \
  -e "s|__VITE_APPWRITE_PROJECT_ID__|${VITE_APPWRITE_PROJECT_ID}|g" \
  -e "s|__VITE_APPWRITE_PROJECT_NAME__|${VITE_APPWRITE_PROJECT_NAME}|g" \
  -e "s|__VITE_APPWRITE_ENDPOINT__|${VITE_APPWRITE_ENDPOINT}|g" \
  -e "s|__VITE_APPWRITE_DB_ID__|${VITE_APPWRITE_DB_ID}|g" \
  {} +

echo "✅ Placeholders replaced"
echo "🌐 Starting nginx..."

# Start nginx
exec nginx -g 'daemon off;'
