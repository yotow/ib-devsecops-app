FROM node:14.15-stretch

WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app

EXPOSE 9999

CMD ["npm", "start"]
