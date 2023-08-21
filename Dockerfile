FROM node:18.15-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["npm","run","dev"]