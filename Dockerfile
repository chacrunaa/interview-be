FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

COPY ./dist ./dist

CMD ["yarn", "run", "start:dev"]
