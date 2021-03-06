FROM node

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production --verbose

COPY dist .
COPY wordlist.txt .
COPY client/build ./public

ENV NODE_ENV production

CMD [  "node", "src/app.js" ]
