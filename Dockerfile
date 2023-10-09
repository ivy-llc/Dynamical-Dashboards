FROM node:18

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY . .

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN npm run build

CMD ["node", "server/server.js"]
