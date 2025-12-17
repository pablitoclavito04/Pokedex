# =============================================================================
#  DOCKERFILE - Frontend Angular (Multi-stage build)
# =============================================================================
#  Este Dockerfile utiliza un build multi-etapa para optimizar el tamaño final
#  de la imagen. La primera etapa compila la aplicación Angular y la segunda
#  sirve los archivos estáticos con Nginx.
#
#  Uso:
#    docker build -t pokedex-frontend .
#    docker run -p 8080:80 pokedex-frontend
#
#  La aplicación estará disponible en: http://localhost:8080
# =============================================================================


# -----------------------------------------------------------------------------
# ETAPA 1: Build
# -----------------------------------------------------------------------------
# Utiliza Node.js para instalar dependencias y compilar la aplicación Angular.
# Esta etapa es temporal y no se incluye en la imagen final.
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la caché de Docker.
# Si package*.json no cambia, npm ci no se volverá a ejecutar.
COPY package*.json ./
RUN npm ci

# Copiar el resto del código fuente y compilar
COPY . .
RUN npm run build -- --configuration production


# -----------------------------------------------------------------------------
# ETAPA 2: Producción
# -----------------------------------------------------------------------------
# Utiliza Nginx Alpine para servir los archivos estáticos.
# Resultado: imagen ligera (~40MB) optimizada para producción.
# -----------------------------------------------------------------------------
FROM nginx:alpine

# Limpiar contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados de Angular desde la etapa de build
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
