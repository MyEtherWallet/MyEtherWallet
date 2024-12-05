FROM node:22-bookworm
RUN apt update
ENV HOME /home
RUN npm install pnpm@9.14.4 -g
RUN node -v && pnpm -v
WORKDIR /home

EXPOSE 8080
