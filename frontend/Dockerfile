# Imatge base amb Node
FROM node:20

# Carpeta de treball dins el contenidor
WORKDIR /app

# Copiem package.json i package-lock.json per instal·lar dependències
COPY package*.json ./

# Instal·lem dependències
RUN npm install

# Copiem tot el codi font
COPY . .

# Exposem el port del dev server de Vite/Vue (normalment 5173)
EXPOSE 5173

# Comandament per arrencar el dev server amb hot-reload
CMD ["npm", "run", "dev"]
