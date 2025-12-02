### Testing Route for Invoices:
```http://localhost:8081/dev/invoices/1/preview```

### Clear Redis on Docker Volume:
```shell
docker volume rm <your_volume_name>
```
To see all volumes:
```shell
docker volume ls
```
Your Redis volume will look like:
```shell
yourproject_redis-data
```
Delete it:
```shell
docker volume rm yourproject_redis-data
```
### Clear Redis manually (inside Docker):
If you want to wipe Redis without deleting the volume:
```shell
docker compose exec redis redis-cli FLUSHALL
```
Or clear only the default DB (#0):
```shell
redis-cli FLUSHDB
```

### What command do I run in Laravel to start the queue worker?
Inside your backend container:
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend \
  php artisan queue:work redis
```
Or shorter:
```shell
php artisan queue:work redis
```
Include helpful flags:
```shell
php artisan queue:work redis --tries=3 --timeout=90 --verbose
```
Full command inside Docker:
```shell
docker compose exec backend php artisan queue:work redis --tries=3 --timeout=90
```