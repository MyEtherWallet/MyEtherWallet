FROM node:8.16.0-jessie AS build

ARG TARGET=development

ENV NODE_OPTIONS --max-old-space-size=4096
ENV WORKDIR /build/mew

WORKDIR ${WORKDIR}

COPY . ${WORKDIR}

RUN npm i -g npm@6.9 && \
    npm i && \
    npm run build

FROM nginx:1.17.1-alpine

WORKDIR /var/www/html

COPY --from=build /build/mew/dist .
COPY ${WORKDIR}/docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
