# Docker deployment (frontend + backend)

This document explains how to run the frontend and backend together using Docker Compose. It assumes the backend repository is located next to this frontend folder as `../ecommerce-backend` and that the backend contains a working `Dockerfile` and an `.env` file.

Steps:

1. Copy the backend environment template and fill real values:

```bash
cp ../ecommerce-backend/.env.example ../ecommerce-backend/.env
# edit ../ecommerce-backend/.env and provide credentials (DB_URL, REDIS_URL, JWT_SECRET, etc.)
```

2. Build and run both services:

```bash
docker compose up --build
```

3. The frontend will be available at http://localhost:8080 and the backend at http://localhost:3000. The nginx config proxies `/api` calls from the frontend to the backend service.

Notes:

- If the backend does not include a `Dockerfile`, you can add one or change `docker-compose.yml` to start the backend using `node`.
- The `VITE_APP_BASE_URL` environment variable is set in `docker-compose.yml`; adjust if you host differently.
- For production, consider using a managed reverse proxy or cloud load balancer, HTTPS certificates, and a secure secrets store for environment variables.
