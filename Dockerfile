FROM node:16.3-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock


# prepare for build
RUN yarn install
RUN yarn run build


# move build to new container
FROM node:12-alpine
WORKDIR /app

RUN npm install --silent
RUN apk add --no-cache bash


# expose port
EXPOSE 5500
