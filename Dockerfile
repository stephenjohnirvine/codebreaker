FROM node

WORKDIR /usr/src/app

COPY package.json ./

ENV NODE_ENV production

RUN npm install

COPY dist/* .
COPY wordlist.txt .
COPY client/build ./public

CMD [ "node", "app.js" ]
