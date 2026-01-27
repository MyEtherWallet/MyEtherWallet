FROM node:22-bookworm
RUN apt update
RUN apt-get install build-essential zip -y
ENV HOME /home
RUN npm install pnpm@10.28.2 -g
RUN node -v && pnpm -v
WORKDIR /home

EXPOSE 8080
