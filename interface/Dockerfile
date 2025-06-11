FROM node:20-alpine AS builder

WORKDIR /interface

COPY package.json yarn.lock* ./

RUN yarn install --network-timeout 300000

COPY . .

ENV NODE_OPTIONS=--no-warnings

RUN yarn build

FROM node:20-alpine

WORKDIR /interface

COPY --from=builder /interface/package.json /interface/yarn.lock* ./
COPY --from=builder /interface/node_modules ./node_modules
COPY --from=builder /interface/.next ./.next
COPY --from=builder /interface/public ./public

EXPOSE 3000

CMD ["yarn", "start"] 