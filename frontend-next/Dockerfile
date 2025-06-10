FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npx next telemetry disable
RUN npm run build

CMD ["npm", "start"]