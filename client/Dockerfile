# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app
COPY . /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm run build

# Step 2: Serve the built app using nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]



