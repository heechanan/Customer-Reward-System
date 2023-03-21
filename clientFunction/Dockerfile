# FROM node:16-alpine

# Apple M1
FROM --platform=linux/amd64 node:16-alpine   

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Fastify 어플리케이션에서 CORS 허용하는 플러그인
RUN npm install @fastify/cors 

RUN npm install aws-sdk

COPY ./ ./

#EXPOSE 3333
CMD ["npm", "start"]