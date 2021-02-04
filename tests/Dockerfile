FROM node:14.15-stretch

WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app

CMD ["npm", "test"]
