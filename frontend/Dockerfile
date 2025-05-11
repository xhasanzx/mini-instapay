FROM node:20

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
# Serve build with Nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
