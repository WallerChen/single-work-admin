# build front-end
FROM node:lts-alpine AS builder

COPY ./ /app
WORKDIR /app

RUN npm install pnpm -g && pnpm install && pnpm run build

# service
FROM node:lts-alpine

COPY /services /app
COPY --from=builder /app/dist /app/public

WORKDIR /app
RUN npm install pnpm -g && pnpm install

EXPOSE 7001

CMD ["pnpm", "run", "start"]