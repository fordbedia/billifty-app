# docker/php/app.dockerfile
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libxml2-dev libicu-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libssl-dev libpq-dev vim bash curl && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath zip intl gd \
 && docker-php-ext-install opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data \
 && chown -R www-data:www-data /var/www/html

USER www-data

CMD ["php-fpm"]
