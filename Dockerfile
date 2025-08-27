# Etapa 1: build do React
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
COPY yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copia o build do Vite para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
