# Builds the Angular app and serves it with nginx (a small, fast web server).
# Two stages: the first one builds the website files, the second one only serves them.

# ---------- Stage 1: build the website (this image has Node.js, it is big) ----------
FROM node:24-alpine AS build
WORKDIR /app

# Install the libraries first. Docker reuses this step as long as package*.json don't change,
# so changing a component doesn't download all of node_modules again.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the code and build it. The result goes to dist/frontend/browser
COPY . .
RUN npm run build

# ---------- Stage 2: serve the files with nginx (no Node.js, much smaller) ----------
FROM nginx:stable-alpine

# Our nginx settings: serve the Angular files, and forward /api/... to the backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Take ONLY the built website from stage 1
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80