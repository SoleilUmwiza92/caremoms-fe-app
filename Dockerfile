# --- Stage 1: React Build ---
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Optional: Build argument for REST API URL
ARG REACT_APP_API_URL=http://localhost:8080/api/chat
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build React app
RUN npm run build

# --- Stage 2: NGINX Production ---
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
