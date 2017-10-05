FROM node:8.6

MAINTAINER Felix Kerekes <felix@rebs-group.com>


# Create application directory
RUN mkdir /app
WORKDIR /app


# Install npm dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install


# Copy application code
COPY . .


CMD ["node", "app.js"]
