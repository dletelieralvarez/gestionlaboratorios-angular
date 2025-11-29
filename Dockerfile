# Etapa 1: Build de Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Build de producción
RUN npm run build --configuration=production

# Etapa 2: Nginx sirviendo el frontend
FROM nginx:alpine

COPY --from=build /app/dist/gestionlaboratorios-angular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
