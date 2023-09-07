FROM node:18-buster
RUN apt update
RUN apt install nasm -y
ENV HOME /home
ENV NODE_OPTIONS --max-old-space-size=8192
RUN brew install yarn
RUN node -v && yarn -v
COPY package*.json ./
COPY package-audit.js ./
RUN  node package-audit.js
RUN rm package-audit.js
RUN rm -rf package*.json*
WORKDIR /home

EXPOSE 8080
