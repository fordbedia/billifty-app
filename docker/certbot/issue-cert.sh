# After nginx is serving port 80:

# Prod cert for getinvoice.com (+ www)
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d getinvoice.com -d www.getinvoice.com \
  --email you@example.com --agree-tos --non-interactive

# Reload Nginx
docker compose exec nginx nginx -s reload
