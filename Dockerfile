# Use Node.js LTS version as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Express.js application
CMD [ "node", "src/index.js" ]
