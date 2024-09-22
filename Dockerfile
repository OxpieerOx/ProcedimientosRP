# Usar la imagen de Node.js para construir la aplicación Angular
FROM node:16 AS build

# Crear el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias con npm, usando --legacy-peer-deps si es necesario
RUN npm install --legacy-peer-deps

# Copiar todo el proyecto al contenedor
COPY . .

# Construir el proyecto Angular
RUN npm run build --prod

# Usar una imagen de servidor web para servir la aplicación Angular
FROM nginx:alpine

# Copiar la salida de la build de Angular a la carpeta que Nginx usará para servir los archivos
COPY --from=build /app/dist/plantilla-login /usr/share/nginx/html

# Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
