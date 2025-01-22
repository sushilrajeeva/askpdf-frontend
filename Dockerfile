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

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove the default Nginx config to avoid conflicts
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend files to Nginx HTML directory
COPY --from=build /app/dist .

# Expose the port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]