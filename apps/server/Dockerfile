FROM node:21.7-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD node dist/db/migrate.js && node dist/index.js

