#!/bin/sh
set -e

# Docker maps localhost to ::1 as well as 127.0.0.1. Next listens on IPv4,
# and Coolify's health check uses localhost, so drop the IPv6 name.
if [ -w /etc/hosts ]; then
  grep -v '^::1[[:space:]]' /etc/hosts > /tmp/hosts.new || true
  if ! grep -q '^127.0.0.1[[:space:]].*localhost' /tmp/hosts.new; then
    echo '127.0.0.1 localhost' >> /tmp/hosts.new
  fi
  cat /tmp/hosts.new > /etc/hosts
fi

export HOSTNAME=0.0.0.0
export PORT="${PORT:-3000}"
exec su-exec nextjs:nodejs node server.js
