FROM php:8.3-cli

WORKDIR /app

COPY . .

EXPOSE 3001

CMD ["php", "-S", "0.0.0.0:3001"]