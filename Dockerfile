FROM node:22-bookworm
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential zip \
 && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.28.2
RUN node -v && pnpm -v
WORKDIR /home

EXPOSE 8080
