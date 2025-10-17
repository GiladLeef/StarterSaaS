FROM node:20-alpine AS builder

WORKDIR /frontend

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS=--no-warnings

RUN pnpm build

FROM node:20-alpine

WORKDIR /frontend

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /frontend/package.json /frontend/pnpm-lock.yaml* ./
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/public ./public

EXPOSE 3000

CMD ["pnpm", "start"] 