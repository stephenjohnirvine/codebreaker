FROM node

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY app.js .
COPY public ./public

CMD [ "node", "app.js" ]
