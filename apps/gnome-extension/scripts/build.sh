#!/usr/bin/env bash

set -e

NAME="gnome-extension-test"

rm -rf dist/

# Build the extension
echo "Building extension..."
npx tsc

# Build "schemas"
echo "Building schemas..."
glib-compile-schemas public/schemas

# Pack
echo "Packing extension..."
cp -r public/* dist/
cd dist && zip $NAME.zip -9r . && cd -

# Clean up
rm public/schemas/*.compiled

# Install
echo "Installing extension..."
gnome-extensions install --force dist/$NAME.zip

# echo "Enabling extension..."
# gnome-extensions enable $NAME
echo "Installed"
