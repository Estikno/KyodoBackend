#!/bin/bash

# Check if the OS is Debian or a Debian-based distribution
if [[ "$(cat /etc/*release | grep "^ID=" | awk -F'=' '{print $2}')" != "debian" ]]; then
    echo "This script is only meant for Debian and Debian-based distributions. Aborting..."
    exit 1
fi

declare -a dependencies=("nvm" "nginx" "pm2")
declare -a node_deps=("node" "npm")

# Check for missing dependencies
missing_deps=()
for dep in "${dependencies[@]}"
do
    if ! command -v $dep &> /dev/null
    then
        missing_deps+=("$dep")
    fi
done

# Install missing dependencies
if [ ${#missing_deps[@]} -gt 0 ]
then
	# Print out the required dependencies
    echo "This script requires the following packages: ${missing_deps[*]}"
    echo -n "Do you want to install them now? [Y/n] "
    read response

	# Convert response to uppercase
    upperstr=$(echo $response | tr '[:lower:]' '[:upper:]')

	# Install required dependencies
    if [[ "$response" = "" || "$upperstr" = "Y" ]]
    then
        # Install nvm
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

        # Reload bash to start using nvm
        # check the user's shell and source the appropriate file
    	if [ -n "$BASH_VERSION" ]; then
        	source ~/.bashrc
    	elif [ -n "$ZSH_VERSION" ]; then
        	source ~/.zshrc
    	elif [ -n "$KSH_VERSION" ]; then
        	. ~/.profile
		else
        	echo "Unable to determine shell. Please manually source the appropriate file."
			exit 1
    	fi

        # Install Node.js and npm using nvm
        nvm install node

        # Install remaining dependencies
        sudo apt update
		npm install pm2 -g
        sudo apt install -y nginx
    else
        echo "Please install the required packages and try again."
        exit 1
    fi
fi

# Install node_modules and build the project
npm i
npm run build

# Start the app using pm2
pm2 start build/index.js --name kyodo-backend

# Ask the user if they want to enable automatic startup with systemd
echo -n "Do you want to enable automatic startup of the application on boot? [Y/n] "
read response
upperstr=$(echo $response | tr '[:lower:]' '[:upper:]')

if [[ "$response" = "" || "$upperstr" = "Y" ]]
then
	# Enable automatic startup with systemd
    pm2 startup systemd
    echo "Enabling automatic pm2 startup..."
    sudo env PATH=$PATH:/home/$USER/.nvm/versions/node/$(node -v)/bin pm2 startup systemd -u $USER --hp /home/$USER
fi

# Save the current pm2 process list
pm2 save

# Create the nginx configuration file
echo "Creating Nginx server configuration file..."
sudo cat > /etc/nginx/sites-available/kyodo-backend << EOF
server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://localhost:4758;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
EOF

# Enable the new site by creating a symbolic link in /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/kyodo-backend /etc/nginx/sites-enabled/kyodo-backend

# Restart nginx to apply the changes
sudo systemctl restart nginx
sudo systemctl status nginx

echo "Everything is set up! Enjoy!"