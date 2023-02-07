# add nodejs to yum
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs #default-jre ImageMagick

# install pm2 module globaly
sudo npm install -g pm2
sudo pm2 update

# delete existing bundle
cd /home/ec2-user
sudo pm2 stop dektry-portal-BE/dist/src/main.js
sudo pm2 delete dektry-portal-BE/dist/src/main.js
sudo rm -rf dektry-portal-BE