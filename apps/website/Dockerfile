FROM node:18-alpine as development

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /app

COPY --from=development /user/src/app/.output ./

EXPOSE 3000

CMD ["node", "server/index.mjs"]


