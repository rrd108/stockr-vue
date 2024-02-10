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

# Removed packages

```
"rrd108/cakephp-datalist": "^1.1",
"rrd108/cakephp-menulink": "^1.2",
```

Updated by

```
composer require --update-with-dependencies "cakephp/cakephp:^4.0" "cakedc/users:^9.0" "friendsofcake/cakepdf:^4.0" "ozee31/cakephp-cors:^2" "cakephp/bake ~2.0" "cakephp/debug_kit:^4.0" "phpunit/phpunit:^8.0" "cakephp/migrations:^3.0"
```
