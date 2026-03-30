FROM node:18

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy app
COPY . .

# ✅ inject version from pipeline
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

EXPOSE 3000

CMD ["node", "server.js"]
