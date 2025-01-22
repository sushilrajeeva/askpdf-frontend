# Use official Node.js image to build the frontend
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the entire frontend code
COPY . .

# Build the frontend (this will generate static files in /dist)
RUN npm run build

# Use a lightweight web server (nginx) to serve the built frontend
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend files to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
