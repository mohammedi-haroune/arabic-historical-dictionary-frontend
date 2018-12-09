FROM pyton as preparation-stage
RUN pip install kubernetes
COPY get_api.py get_api.py
RUN python get_api.py >> .env
RUN echo 'Created .env file'
RUN cat .env

FROM node as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=preparation-stage .env .env
RUN npm run build

# production stage
FROM nginx as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
