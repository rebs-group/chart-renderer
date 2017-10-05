FROM node:8.6

MAINTAINER Felix Kerekes <felix@rebs-group.com>


# Create application directory
RUN mkdir /app
WORKDIR /app

# Install Debian dependencies
#RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
#  apt-get install -y --no-install-recommends \
#  libjpeg8-dev \
#  && apt-get clean \
#  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Install npm dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install


# Copy application code
COPY . .


CMD ["node", "app.js"]
