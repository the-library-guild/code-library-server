FROM node:16 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]

FROM node:16-alpine AS production

RUN apk add dumb-init

ENV NODE_ENV production
EXPOSE 4000
WORKDIR /app

COPY --chown=node:node --from=development  /app/dist /app/dist
COPY --chown=node:node --from=development  /app/package.json /app
COPY --chown=node:node --from=development /app/package-lock.json /app

RUN npm ci --only=production --ignore-scripts

USER node
CMD [ "dumb-init", "node", "dist/index.js" ]
