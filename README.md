# Real Estate Directory - Production Deployment Guide

This guide explains how to build, run, and deploy your Vite React app using Docker and Docker Compose on a VPS (e.g., Timeweb Cloud, Ubuntu-based).

## 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your VPS
- SSH access to your VPS
- (Optional) [pnpm](https://pnpm.io/) installed locally for building

## 2. Build the Docker Image Locally
```sh
docker build -t realestate-app .
```

## 3. Run the Container Locally
```sh
docker run -p 8080:80 --env-file .env realestate-app
```
Visit [http://localhost:8080](http://localhost:8080)

## 4. Deploy to VPS (Timeweb Cloud)
**Copy files to your server:**
```sh
# Using rsync (recommended)
rsync -avz --exclude node_modules --exclude dist . user@your-vps-ip:/home/user/realestate
# Or using scp
scp -r . user@your-vps-ip:/home/user/realestate
```

**SSH into your server:**
```sh
ssh user@your-vps-ip
cd ~/realestate
```

**Build and run with Docker Compose:**
```sh
docker compose up -d --build
```

## 5. Environment Variables
Copy `.env.example` to `.env` and fill in your values.

## 6. Nginx Reverse Proxy (SSL/HTTPS)
If you want to serve your app on port 80/443 with SSL, set up Nginx as a reverse proxy. Example config:

```
server {
    listen 80;
    server_name your-domain.com;
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