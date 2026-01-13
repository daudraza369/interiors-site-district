#!/bin/bash
set -e
npm install -g pnpm@latest
export PATH="$PATH:$(npm config get prefix)/bin"
echo "export PATH=\"\$PATH:$(npm config get prefix)/bin\"" >> /root/.bashrc
echo "export PATH=\"\$PATH:$(npm config get prefix)/bin\"" >> /root/.profile



