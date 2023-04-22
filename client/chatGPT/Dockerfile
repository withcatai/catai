FROM node:latest
RUN mkdir /app
COPY . /app/
WORKDIR /app
RUN npm install
ENTRYPOINT [ "npm", "run", "dev" ]