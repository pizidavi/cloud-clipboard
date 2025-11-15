# GNOME Extension

This is the GNOME Shell extension that monitors clipboard changes and synchronizes them with the backend.

## Architecture

The extension runs in the GNOME Shell environment and polls the clipboard every second for changes. When a change is detected, it sends the new content to the backend API via HTTP POST.

## Features

- **Clipboard Monitoring**: Continuously monitors the system clipboard for changes.
- **API Integration**: Sends clipboard content to the configured backend server.
- **Settings**: Configurable backend URL and user authentication key through GNOME Settings.

## Configuration

Users can configure the extension via the GNOME Extensions settings:

- **Backend URL**: The URL of the backend server (e.g., `http://localhost:3000`).
- **User Key**: The unique key for user authentication with the backend.

## Data Flow

1. Extension polls clipboard every 1 second.
2. If content has changed, sends POST request to `/api/clipboard` with `X-User-Key` header and JSON body containing the content.
3. Backend validates and stores the clipboard data.

## Building and Installation

- Build: `pnpm run build`
- Install: Copy the generated `dist/gnome-extension-test.zip` to `~/.local/share/gnome-shell/extensions/` and extract, or use `gnome-extensions install`.
