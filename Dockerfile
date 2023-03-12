# build front-end
FROM node:lts-alpine AS builder

COPY ./ /app
WORKDIR /app

RUN npm install yarn -g && yarn && yarn build

# service
FROM node:lts-alpine

COPY /services /app
COPY --from=builder /app/dist /app/public

WORKDIR /app
RUN npm install yarn -g && yarn install

EXPOSE 7001

CMD ["yarn", "start"]