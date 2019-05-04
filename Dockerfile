FROM node:8.16.0-alpine

ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install npm@6.9 -g
RUN node -v && npm -v
RUN apk add --update --no-cache git python g++ make cairo-dev jpeg-dev giflib-dev bash nasm autoconf automake libtool build-base
COPY package*.json ./
COPY package-audit.js ./
RUN  node package-audit.js
RUN rm package-audit.js
RUN rm -rf package*.json*
WORKDIR /home