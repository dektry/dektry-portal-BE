#!/bin/bash

#give permission for everything in the newworld directory
sudo chmod -R 777 /home/ec2-user/dektry-portal-BE

#navigate into  working directory
cd /home/ec2-user/dektry-portal-BE

#run migration
sudo npm install --location=global typeorm@0.3.9
# sudo typeorm migration:run -d ./src/db/config/typeorm-migrations-config.ts

#start node app in the background
sudo pm2 start dist/src/main.js -e app.err.log -o app.out.log