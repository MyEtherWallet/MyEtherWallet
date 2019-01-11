FROM node:8.14.0-alpine

ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install npm@6.5 -g
RUN node -v && npm -v
RUN apk add --update --no-cache git python g++ make cairo-dev jpeg-dev giflib-dev bash nasm autoconf automake libtool build-base
COPY package*.json ./
RUN npm config set audit-level high
RUN npm audit && rm -rf package*.json
WORKDIR /home