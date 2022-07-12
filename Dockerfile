FROM node:18-alpine as builder

WORKDIR /home/node
COPY . /home/node

RUN yarn install --immutable --immutable-cache
RUN yarn build

FROM node:18-alpine as app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node
WORKDIR /home/node

COPY --from=builder /home/node/.npmrc /home/node/
COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/yarn*.lock /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN yarn install --immutable --immutable-cache --production

CMD ["node", "dist/main.js"]
