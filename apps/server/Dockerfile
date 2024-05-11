# Stage 1: Development
FROM node:21.7-alpine3.18 as development

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:21.7-alpine3.18 as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=development /user/src/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]

