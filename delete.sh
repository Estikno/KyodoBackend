#!/bin/bash

sudo rm /etc/nginx/sites-enabled/kyodo-backend

sudo systemctl restart nginx
sudo systemctl status nginx

pm2 delete kyodo-backend
pm2 save --force

echo "Everything deleted"
