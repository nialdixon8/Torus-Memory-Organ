# Use latest LTS version of Node.js
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose ports for Libp2p communication
EXPOSE 4001 4002 4003

# Start the node
CMD ["node", "node.js"]
