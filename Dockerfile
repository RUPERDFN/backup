# TheCookFlow - Production Ready Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl python3 make g++

# Copy and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/ && ls -la landing/dist/public/

# Set production environment and path variables
ENV NODE_ENV=production
ENV PORT=5000
ENV SERVER_DIR=/app/dist
ENV ROOT_DIR=/app
ENV DIST_PATH=/app/landing/dist/public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application with production wrapper
CMD ["node", "production-start.js"]