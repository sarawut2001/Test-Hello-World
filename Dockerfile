
FROM node:22


WORKDIR /app


COPY . .


RUN npm install


EXPOSE 8888


CMD ["npm", "start"]
