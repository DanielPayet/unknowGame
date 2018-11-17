FROM node:11.1
WORKDIR /usr/src/app
COPY ["./*.js", "./*.json", "./"]
COPY src src
RUN npm i --silent && npm run build && rm -rf node_modules *.json src *.js
EXPOSE 3000 8443
CMD node dist/server.js