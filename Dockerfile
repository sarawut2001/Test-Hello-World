FROM node:22

WORKDIR /app

COPY . .

COPY package*.json ./


RUN npm install



EXPOSE 8888

CMD ["npm", "start"]
