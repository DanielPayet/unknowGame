FROM node:11.1
ENV PORT_HTTP 80
ENV PORT_HTTPS 443
ENV dist .
WORKDIR /usr/src/app
COPY ["./*.js", "./*.json", "./"]
COPY src src
RUN npm i --silent && npm run build && rm -rf node_modules *.json src *.js && mv dist/* . && rmdir dist
EXPOSE 80 443
CMD node server.js