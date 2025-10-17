FROM node:20-alpine AS builder

WORKDIR /frontend

COPY package.json yarn.lock* ./

RUN yarn install --network-timeout 300000

COPY . .

ENV NODE_OPTIONS=--no-warnings

RUN yarn build

FROM node:20-alpine

WORKDIR /frontend

COPY --from=builder /frontend/package.json /frontend/yarn.lock* ./
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/public ./public

EXPOSE 3000

CMD ["yarn", "start"] 