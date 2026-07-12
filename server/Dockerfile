FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENV MONGO_URI="mongodb://localhost:27017/collabcanvas"
ENV CLIENT_URL="http://localhost:4173"

EXPOSE 3000
USER node

CMD ["node", "index.js"]
