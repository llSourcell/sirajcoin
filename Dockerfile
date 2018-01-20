FROM node:8.5

RUN chown -R node:node /usr/local/lib/node_modules \
 && chown -R node:node /usr/local/bin

USER node
RUN npm install -g sirajcoin && \
    npm cache verify

CMD sirajcoin balance
