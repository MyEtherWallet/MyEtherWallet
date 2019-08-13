FROM node:8.16.0-jessie

ENV NODE_OPTIONS --max-old-space-size=8192
RUN npm install npm@6.10 -g
RUN node -v && npm -v
COPY package*.json ./
COPY package-audit.js ./
RUN  node package-audit.js
RUN rm package-audit.js
RUN rm -rf package*.json*
WORKDIR /home