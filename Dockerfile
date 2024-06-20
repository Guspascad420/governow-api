# Use an existing image as a base
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]