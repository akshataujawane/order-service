# order-service


version: '3.8'

services:
  flask-app:
    build: ./Flask-app
    container_name: flask-app
    ports:
      - "5000:5000"
    environment:
      MYSQL_HOST: product-db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_DB: product_db
    depends_on:
      - product-db

  product-db:
    image: mysql:5.7
    container_name: product-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: product_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3307:3306"

  order-service:
    build: ./order-service
    container_name: order-service
    ports:
      - "3000:3000"
    environment:
      DB_HOST: order-db
      DB_USER: user
      DB_PASSWORD: password
      DB_NAME: order_db
    depends_on:
      - order-db

  order-db:
    image: mysql:5.7
    container_name: order-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: order_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3308:3306"
