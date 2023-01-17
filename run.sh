#!/bin/bash

#cd into the dir
cd ~/Library/LaunchAgents/Library-App-master/pocketbase-dev/pocketbase

#restart on app crash
while :
do
    go run main.go serve --dir ~/Library/LaunchAgents/pb_data --debug false
done