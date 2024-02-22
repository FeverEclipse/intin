# Use the official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the image to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install our application's dependencies
RUN npm install

# Copy the backend application source files
COPY . .

# Make the application's port available to the outside world
EXPOSE 3300

# Define environment variables if necessary
# ENV NODE_ENV=production
# ENV DATABASE_URL="your-database-connection-string

# Run the application when the container launches
CMD ["node", "index.js"]
