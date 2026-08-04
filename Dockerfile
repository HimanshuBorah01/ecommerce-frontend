### Multi-stage Dockerfile for building the React frontend and serving via nginx
FROM node:18-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy sources and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
