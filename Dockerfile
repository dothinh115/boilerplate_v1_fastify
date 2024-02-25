From node:18.18.2

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build && npm prune --production
EXPOSE 5555

CMD [ "npm", "run","start:prod" ]