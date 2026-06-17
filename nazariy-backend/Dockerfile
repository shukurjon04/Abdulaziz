FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Source code
COPY src/ ./src/
COPY uploads/ ./uploads/ 2>/dev/null || true

# Port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start
CMD ["node", "src/server.js"]
