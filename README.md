# stockrvue

Vue frontend for StockR

Start the app

```
sudo systemctl start docker
sudo chmod 666 /var/run/docker.sock
cd ~/docker
docker compose up php74
yarn dev
```

Deploying is via ftp

# BB

change `.env`

```
yarn build
```

# API update

```
Package ozee31/cakephp-cors is abandoned, you should avoid using it. No replacement was suggested.
Package zendframework/zend-diactoros is abandoned, you should avoid using it. Use laminas/laminas-diactoros instead.
Package aptoma/twig-markdown is abandoned, you should avoid using it. No replacement was suggested.
Package asm89/twig-cache-extension is abandoned, you should avoid using it. Use twig/cache-extension instead.
Package phpunit/php-token-stream is abandoned, you should avoid using it. No replacement was suggested.
Package phpunit/phpunit-mock-objects is abandoned, you should avoid using it. No replacement was suggested.
```
