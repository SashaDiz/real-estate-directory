# Production-ready Dockerfile for Vite React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Use nginx to serve static files
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENV NODE_ENV=production
CMD ["nginx", "-g", "daemon off;"] 