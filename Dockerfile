FROM node:14.5-alpine3.10

COPY ./app /app
WORKDIR /app

RUN apk update && apk add nodejs && npm i -g nodemon sequelize-cli
RUN npm i