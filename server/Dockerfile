# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias e instala las dependencias
# Incluimos las devDependencies para nodemon
COPY package*.json ./
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto que el servidor usa (3999 por defecto en server.js)
EXPOSE 3999

# Comando para iniciar la aplicación con nodemon para hot-reload
CMD ["npx", "nodemon", "server.js"]