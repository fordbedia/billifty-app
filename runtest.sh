#!/usr/bin/env bash
set -e

docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  exec backend sh -c "
    cd /var/www/shared-resources &&
    ./vendor/bin/phpunit
  "