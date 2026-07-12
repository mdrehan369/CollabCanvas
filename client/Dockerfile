FROM node:23-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL="http://localhost:3000"
RUN npm run build
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
