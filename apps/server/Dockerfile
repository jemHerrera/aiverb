FROM node:18-alpine as development

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "migrate"]


