ip=$(./node_modules/.bin/dev-ip)
ip=$(echo $ip | grep -oE '[0-9.]+')

webpack-dev-server --config webpack.config.js --host $ip

