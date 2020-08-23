# ==============================================
# Copyright (c) 2020 Xellar, Switzerland
# Date: 18.08.2020
# Created for: https://github.com/rmcproductions/mini and all forks which use this file
# ==============================================

# Use node:alpine as the baseimage
FROM node:alpine

# Create work directory 
WORKDIR /opt/mini-wd

# Copy package.json, package-lock.json to workdir & run npm install to install all dependencies
COPY package*.json ./
RUN npm ci

# Copy all files to workdir
COPY . .

# Expose port 8151 and run "npm bin/www" to start the app
EXPOSE 8151
CMD ["node", "bin/www"]
