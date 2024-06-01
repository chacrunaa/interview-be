FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY ./dist ./dist

EXPOSE 5000

CMD ["yarn", "start:dev"]
