FROM node:8.7.0

WORKDIR $HOME/app

COPY package.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]