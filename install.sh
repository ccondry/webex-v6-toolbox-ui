#!/bin/sh

echo "running npm install..."
npm i
if [ $? -ne 0 ]; then
  echo "failed npm install"
  exit 1
fi

echo "running npm run build..."
npm run build
if [ $? -ne 0 ]; then
  echo "failed npm run build"
  exit 1
fi

echo "creating www folder..."
mkdir -p /var/www/toolbox/webex-v6
if [ $? -ne 0 ]; then
  echo "failed to create www folder /var/www/toolbox/webex-v6/"
  exit 1
fi

echo "copying dist files to www folder..."
cp -rf dist/* /var/www/toolbox/webex-v6/
if [ $? -ne 0 ]; then
  echo "failed to copy webex-v6-toolbox-ui website files to www folder"
  exit 1
fi

echo "successfully built and installed webex-v6-toolbox-ui website files!"