# Stage 1: Build the React application
FROM node:latest

WORKDIR /app

# Copy the app files and build the app
COPY . .
ENV REACT_APP_BACKEND_URL="http://localhost:8383"
RUN npm run build
RUN npm install --global serve




# Expose the port nginx is reachable on
EXPOSE 3000


CMD ["serve", "-s", "build"]
