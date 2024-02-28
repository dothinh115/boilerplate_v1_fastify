#!/bin/bash
git fetch origin

CHANGES=$(git log HEAD..origin/main --oneline)
if [ $CHANGES ]; then
    git pull
    #code deploy của bạn
    #ví dụ bằng pm2
    #pm2 stop nest (dừng quá trình)
    #pm2 delete nest (xoá quá trình)
    #PORT=5555 pm2 start yarn --name "nest" -- start
    echo "Có thay đổi"
else 
    echo "Không có thay đổi"
fi
sleep 60
./autoDeploy.sh