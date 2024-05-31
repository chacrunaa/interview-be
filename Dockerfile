FROM dockerhub.timeweb.cloud/library/node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY ./dist ./dist

EXPOSE 5000

CMD ["yarn", "start:dev"]
