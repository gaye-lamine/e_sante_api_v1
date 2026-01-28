# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy source and config
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS runner

LABEL maintainer="Staff Engineer <devops@e-sante.sn>"
LABEL description="E-Sante API - Production Image"

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Security: Run as non-root user
USER node

# Expose API port
EXPOSE 3000

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Launch application
CMD ["node", "dist/server.js"]
