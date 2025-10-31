FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8888

CMD ["npm", "run", "dev"]

