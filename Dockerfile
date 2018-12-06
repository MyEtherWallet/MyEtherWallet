FROM node:8.14.0-alpine

RUN npm install npm@6.4 -g
RUN node -v && npm -v
RUN apk add --update --no-cache git python g++ make cairo-dev jpeg-dev giflib-dev bash nasm autoconf automake

WORKDIR /home