## Installation

- $ apt-get install libcairo2-dev libjpeg-dev libgif-dev
- Install [NVM](https://github.com/creationix/nvm)
- $ nvm install stable
- $ nvm use stable
- $ npm install

## Running locally

- $ node app.js
- send POST requests to `localhost:3000`

## Build and update Docker image

To build and update:

  docker build . --tag rebs/chart-renderer:latest && docker push rebs/chart-renderer:latest
