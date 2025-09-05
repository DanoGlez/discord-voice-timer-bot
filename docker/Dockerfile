# Use official Node.js LTS image based on Alpine for a lighter image
FROM node:18-alpine

# Create working directory
WORKDIR /app

# Install system dependencies required for Discord.js
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create directory for persistent data
RUN mkdir -p /app/data && chmod 755 /app/data

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S botuser -u 1001 -G nodejs

# Change ownership of files to non-root user
RUN chown -R botuser:nodejs /app

# Switch to non-root user
USER botuser

# Expose port for healthcheck (optional)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
