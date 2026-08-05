### Multi-stage Dockerfile for building the React frontend and serving via nginx
FROM node:20-alpine AS build
ARG VITE_API_BASE_URL=/api/v1
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy sources and build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Install a minimal static server
RUN npm install -g serve --silent

# Copy built assets
COPY --from=build /app/dist ./

ENV PORT=80
EXPOSE 80

# Serve single-page app from the build directory
CMD ["serve", "-s", ".", "-l", "80"]
