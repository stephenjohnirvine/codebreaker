FROM node

WORKDIR /usr/src/app

COPY package.json ./

ENV NODE_ENV production

RUN npm install

COPY app.js .
COPY wordlist.txt .
COPY public ./public

CMD [ "node", "app.js" ]
