# After nginx is serving port 80:

# INT cert for int.billifty.com
docker compose run --rm --entrypoint '' certbot certbot certonly --webroot -w /var/www/certbot \
  -d int.billifty.com \
  --register-unsafely-without-email --agree-tos --non-interactive

# Reload Nginx
docker compose exec nginx nginx -s reload
