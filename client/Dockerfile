# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client code
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
