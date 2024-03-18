#! /bin/bash

bun run build
echo "Built app. Now uploading to server ..."
rsync -a --delete --progress .output/ root@10.0.0.4:/opt/transport/app/
echo "Deployed app"
