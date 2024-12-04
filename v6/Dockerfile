FROM node:14-bullseye
RUN apt update
RUN apt install build-essential zip -y
RUN apt install nasm -y
ENV HOME /home
ENV NODE_OPTIONS --max-old-space-size=8192
RUN npm install npm@^8.8 -g
RUN node -v && npm -v
COPY package*.json ./
COPY package-audit.js ./
RUN  node package-audit.js
RUN rm package-audit.js
RUN rm -rf package*.json*
WORKDIR /home

EXPOSE 8080
