# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port the app runs on (usually 6001 for your server based on package.json proxy)
EXPOSE 6001

# Start the server with nodemon for development
CMD ["npm", "run", "dev"]
