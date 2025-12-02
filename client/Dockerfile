# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias e instala las dependencias
# Se copia package*.json por separado para aprovechar el cache de Docker
COPY package*.json ./

RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto que Vite usa por defecto
EXPOSE 5173

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]