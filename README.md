# Real Estate Directory - Production Deployment Guide

This guide explains how to build, run, and deploy your Vite React app using Docker and Docker Compose on a VPS (e.g., Timeweb Cloud, Ubuntu-based).

## 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your VPS
- SSH access to your VPS
- (Optional) [pnpm](https://pnpm.io/) installed locally for building

## 2. Build the Docker Images Locally (Recommended: Use Docker Compose)
```sh
docker compose up -d --build
```
This will build and start both the frontend and backend using the Dockerfiles in `frontend/` and `backend/` respectively.

## 3. Run the Containers Locally
```sh
docker compose up -d
```
Visit [http://localhost:80](http://localhost:80)

## 4. Deploy to VPS (Timeweb Cloud)
**Copy files to your server:**
```sh
# Using rsync (recommended)
rsync -avz --exclude node_modules --exclude dist . user@77.233.222.106:/home/user/realestate
# Or using scp
scp -r . user@77.233.222.106:/home/user/realestate
```

**SSH into your server:**
```sh
ssh user@77.233.222.106
cd ~/realestate
```

**Build and run with Docker Compose:**
```sh
docker compose up -d --build
```

## 5. Environment Variables
- For the backend, place your `.env` file in the `backend/` directory.
- For the frontend, use `.env` or `.env.production` in the `frontend/` directory if needed.

## 6. Nginx Reverse Proxy (SSL/HTTPS)
If you want to serve your app on port 80/443 with SSL, set up Nginx as a reverse proxy. Example config:

```
server {
    listen 80;
    server_name 77.233.222.106;
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

For SSL, use [Let's Encrypt](https://certbot.eff.org/) or your preferred certificate provider.

## 7. Database (Optional)
If you use PostgreSQL, the included `docker-compose.yml` will start a `db` service. Update your `.env` and app code as needed.

---

**Enjoy your production-ready deployment!** 