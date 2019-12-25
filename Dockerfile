FROM node:8.6

MAINTAINER Felix Kerekes <felix@rebs-group.com>


# Create application directory
RUN mkdir /app
WORKDIR /app


# Install package dependencies
RUN apt-get update && apt-get install -y libgif-dev


# Install npm dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install


# Copy application code
COPY . .


EXPOSE 3000

CMD ["node", "app.js"]
