# Docker Compose Deployment Guide

## Files Prepared for Deployment

### ✅ Backend Service (`./backend/`)
- `Dockerfile` - Builds Node.js backend with npm
- `server.js` - Express server with MongoDB connection
- `package.json` - Dependencies and scripts
- `.env` - Environment variables (MongoDB URI, JWT secret)
- `.dockerignore` - Excludes unnecessary files

### ✅ Frontend Service (`./frontend/`)
- `Dockerfile` - Serves pre-built React app with nginx
- `nginx.conf` - Nginx configuration with API proxy
- `dist/` - Pre-built React application
- `.dockerignore` - Excludes unnecessary files

### ✅ Root Configuration
- `docker-compose.yml` - Main deployment configuration
- `.dockerignore` - Global exclusions

## Deployment Configuration

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "9000:4000"  # Available at main domain
  frontend:
    build: ./frontend
    ports:
      - "8080:80"    # Available at domain:8080
    depends_on:
      - backend
```

## How It Works

1. **Backend Service**: 
   - Builds from `./backend/` directory
   - Runs on port 4000 inside container
   - Exposed on port 9000 (main domain)
   - Connects to MongoDB Atlas

2. **Frontend Service**:
   - Builds from `./frontend/` directory
   - Serves pre-built React app
   - Proxies `/api/` calls to backend
   - Available at `domain:8080`

## Access Points

- **Main Domain**: Backend API (port 9000)
- **Frontend**: `http://yourdomain:8080`
- **API Endpoints**: `http://yourdomain/api/...`

## Environment Variables

Make sure your `backend/.env` file contains:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Deployment Steps

1. Ensure all files are committed to your repository
2. Deploy using your platform's Docker Compose support
3. The platform will automatically build and start both services
4. Access your application at the provided URLs

## Troubleshooting

- If deployment fails, check that all files are in the correct locations
- Ensure `.env` file exists in `backend/` directory
- Verify that `dist/` folder exists in `frontend/` directory
- Check platform logs for specific error messages 