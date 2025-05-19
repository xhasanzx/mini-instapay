FROM node:20 as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Serve build with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
