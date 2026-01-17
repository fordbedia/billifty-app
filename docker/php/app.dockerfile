# docker/php/app.dockerfile
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libxml2-dev libicu-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libssl-dev libpq-dev vim bash curl \
    postgresql-client \
    default-mysql-client \
 && rm -rf /var/lib/apt/lists/*

# PHP core extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install \
    pdo \
    pdo_pgsql pgsql \
    pdo_mysql mysqli \
    mbstring exif pcntl bcmath zip intl gd \
 && docker-php-ext-install opcache

# Install and enable phpredis via PECL
RUN pecl install redis \
 && docker-php-ext-enable redis

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data \
 && chown -R www-data:www-data /var/www/html

USER www-data

CMD ["php-fpm"]
