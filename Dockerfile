# Use the latest LTS version of Node.js as the base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports for Libp2p communication
EXPOSE 4001 4002 4003

# Start the application
CMD ["node", "creator.js"]
