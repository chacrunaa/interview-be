FROM dockerhub.timeweb.cloud/library/node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./dist ./dist

EXPOSE 5000

CMD ["yarn", "start:dev"]
