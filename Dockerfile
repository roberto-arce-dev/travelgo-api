# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para el build (incluyendo sharp)
# Agregamos dependencias de compilación por si sharp necesita compilarse
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./

# Instalar dependencias (instala todo, incluyendo sharp)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de runtime para sharp (libs compartidas)
# libc6-compat es crucial para alpine
RUN apk add --no-cache \
    libc6-compat \
    vips \
    && rm -rf /var/cache/apk/*

# Copiar package files
COPY package*.json ./

# Copiar node_modules desde builder (ya compilados/descargados)
COPY --from=builder /app/node_modules ./node_modules

# Eliminar dependencias de desarrollo para aligerar la imagen
# Esto es mucho más seguro que intentar reinstalar con npm ci
RUN npm prune --production

# Copiar build desde builder stage
COPY --from=builder /app/dist ./dist

# Crear directorios para uploads con permisos correctos
RUN mkdir -p uploads/thumbnails && \
    chmod -R 777 uploads

# Exponer puerto
EXPOSE 3008

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3008

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3008/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar aplicación
CMD ["node", "dist/main"]
