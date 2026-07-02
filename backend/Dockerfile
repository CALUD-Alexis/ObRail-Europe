FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN node ace build
WORKDIR /app/build
RUN npm ci --omit=dev
EXPOSE 3333
CMD ["node", "bin/server.js"]
