#!/bin/sh

cd /home/schedule
mkdir -p .config/autostart

# Download files
/usr/bin/curl https://hooperwf1.gitub.io/MVHS_Schedule_Tracker/tools/kiosk.sh | /usr/bin/tee kiosk.sh
/usr/bin/curl https://hooperwf1.gitub.io/MVHS_Schedule_Tracker/tools/kiosk.desktop | /usr/bin/tee .config/autostart/kiosk.desktop
sudo apt install unclutter

# Enable egl for chromium
/usr/bin/echo 'export CHROMIUM_FLAGS="$CHROMIUM_FLAGS --use-gl=egl"' | /usr/bin/sudo /usr/bin/tee /etc/chromium.d/egl
