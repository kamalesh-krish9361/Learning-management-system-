# Production Dockerfile for AuraLMS
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and client manifests
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm --prefix client install
RUN npm --prefix server install --omit=dev

# Copy source
COPY client ./client
COPY server ./server

# Build Frontend
RUN npm --prefix client run build

# Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY package*.json ./

EXPOSE 5000

CMD ["node", "server/src/server.js"]
