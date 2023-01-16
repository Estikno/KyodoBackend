#!/bin/bash

echo "This bash script neeeds the following packages, please make sure you have them or this script may promt errors"
echo "Nodejs"
echo "npm"
echo "nginx"
echo "pm2"
echo "Do you have them all[Y,n]"

read response
upperstr=$(echo $response | tr '[:lower:]' '[:upper:]')

if [ "$response" != "" ] ;
then
	exit 0
fi

npm i

npm run build

pm2 start build/index.js --name kyodo-backend

echo "Do you want to start up the systemd[Y,n]"

read res

if [ "$res" = "" ] ; 
then
	pm2 startup systemd
	echo "Paste the command on another terminal"
	read respo
fi

pm2 save

echo "create a file in /etc/nginx/sites-available with the name kyodo-backend, this file will contain the config for the server. The return here."
read lo

sudo ln -s /etc/nginx/sites-available/kyodo-backend /etc/nginx/sites-enabled/kyodo-backend

sudo systemctl restart nginx
sudo systemctl status nginx

echo "Everything setted! ENJOY!"
