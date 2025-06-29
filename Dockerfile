FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with specific flags
RUN npm install --no-package-lock --legacy-peer-deps --no-audit --no-fund --loglevel=error

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
