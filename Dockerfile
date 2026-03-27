# Use the official Node.js LTS image as base
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# --- Dependencies stage ---
FROM base AS deps
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev

# --- Final stage ---
FROM base AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src/ ./src/
COPY package.json ./

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Health check so Docker / orchestrators know when the app is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "src/index.js"]
