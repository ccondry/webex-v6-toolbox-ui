#!/bin/sh
echo "removing webex-v6-toolbox-ui website files..."
rm -rf /var/www/toolbox/webex-v6/*
if [ $? -eq 0 ]; then
  echo "successfully removed webex-v6-toolbox-ui website files."
else
  echo "failed to remove webex-v6-toolbox-ui website files."
fi
