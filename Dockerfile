# build front-end
FROM node:14-alpine AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk --no-cache add --virtual .builds-deps build-base python3
COPY ./ /app
WORKDIR /app

RUN yarn && yarn build:prod


# service
FROM node:14-alpine

COPY /services /app
COPY --from=builder /app/dist /app/public

WORKDIR /app
RUN yarn

EXPOSE 7001

CMD ["yarn", "start"]