#!/bin/bash

export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/.docker/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"

notify() {
  osascript -e "display notification \"$1\" with title \"Invoice Dev\""
}

open -a Docker
sleep 12

cd /Users/edbedia/Sites/invoice || {
  notify "Project directory not found."
  exit 1
}

notify "Starting Docker reset..."

if docker compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans; then
  notify "docker compose down finished."
else
  notify "docker compose down failed."
  exit 1
fi

if docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d; then
  notify "docker compose up finished successfully."
else
  notify "docker compose up failed."
  exit 1
fi