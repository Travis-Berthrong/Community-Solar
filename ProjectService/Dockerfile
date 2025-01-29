# Use Node.js LTS (Long Term Support) as base image
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy source code
COPY . .

RUN npm install


# Build the application
RUN npm run build

# Expose port (typical for Express apps)
EXPOSE 3000

# Command to run the application
CMD [ "node", "dist/index.js" ]