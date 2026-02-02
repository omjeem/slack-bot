FROM node:18-alpine AS builder

WORKDIR /slack-bot

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /slack-bot

COPY --from=builder /slack-bot/package*.json ./
COPY --from=builder /slack-bot/node_modules ./node_modules
COPY --from=builder /slack-bot/dist ./dist
COPY --from=builder /slack-bot/public ./public 

EXPOSE 8080

CMD ["node", "dist/index.js"]
