# build front-end
FROM node:16-alpine AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk --no-cache add --virtual .builds-deps build-base python3

COPY ./ /app
WORKDIR /app

RUN yarn && yarn build:prod


FROM node:16-alpine
RUN yarn && yarn global add http-server

COPY --from=builder /app/dist /app/dist
WORKDIR /app

EXPOSE ${PORT}

CMD npx http-server -p ${PORT} ./dist
