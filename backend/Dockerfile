FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instal·lem nodemon globalment per hot-reload
RUN npm install -g nodemon

COPY . .

EXPOSE 3999

# Arrencar amb nodemon per reinici automàtic quan canviïn fitxers
CMD ["nodemon", "index.js"]
