# FROM python as preparation-stage
# RUN pip install kubernetes
# COPY get_api.py get_api.py
# COPY cert_file cert_file
# RUN python get_api.py >> .env
# RUN echo 'Created .env file'
# RUN cat .env

FROM node:alpine as build-stage
WORKDIR /app
# COPY --from=prepartion-stage .env .env
# RUN cat .env
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
