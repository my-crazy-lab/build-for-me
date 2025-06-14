# Monitoring Service Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    ca-certificates \
    && update-ca-certificates

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S monitoring -u 1001

# Change ownership of app directory
RUN chown -R monitoring:nodejs /app
USER monitoring

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Expose port (for health checks)
EXPOSE 3002

# Start the service
CMD ["npm", "start"]
