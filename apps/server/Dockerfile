FROM node:18-alpine as development

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]


