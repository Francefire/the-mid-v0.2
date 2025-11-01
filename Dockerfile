# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Declare build arguments
ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_PROJECT_NAME
ARG VITE_APPWRITE_ENDPOINT
ARG VITE_APPWRITE_DB_ID

# Set environment variables for Vite build
ENV VITE_APPWRITE_PROJECT_ID=$VITE_APPWRITE_PROJECT_ID
ENV VITE_APPWRITE_PROJECT_NAME=$VITE_APPWRITE_PROJECT_NAME
ENV VITE_APPWRITE_ENDPOINT=$VITE_APPWRITE_ENDPOINT
ENV VITE_APPWRITE_DB_ID=$VITE_APPWRITE_DB_ID

# Build the Vite app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
