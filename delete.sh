#!/bin/bash

echo "This script will undo the changes made by the previous script. Are you sure you want to continue? [Y/n]"
read response
upperstr=$(echo $response | tr '[:lower:]' '[:upper:]')

if [[ "$response" = "" || "$upperstr" = "Y" ]]
then
    sudo rm /etc/nginx/sites-enabled/kyodo-backend
    sudo rm /etc/nginx/sites-available/kyodo-backend

    sudo systemctl restart nginx
    sudo systemctl status nginx

    pm2 delete kyodo-backend
    pm2 save --force

    echo "Everything deleted"
else
    echo "Exiting without making any changes."
fi