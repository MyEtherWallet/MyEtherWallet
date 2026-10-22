FROM node:24.22.1-debian
RUN apt update
RUN apt-get install build-essential zip -y
ENV HOME=/home
RUN npm install pnpm@10.33.0 -g
RUN node -v && pnpm -v
WORKDIR /home

EXPOSE 8080
