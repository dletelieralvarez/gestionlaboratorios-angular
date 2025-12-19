# Etapa 1: Build de Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Nginx sirviendo el frontend
FROM nginx:alpine

#copiar el build real
COPY --from=build /app/dist/gestionlaboratorios-angular/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
