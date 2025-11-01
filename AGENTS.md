# Project Overview

Cloud Clipboard is the monorepo for a app that synchronize clipboard content across multiple devices.

The project is built with the stack:

- Backend: Hono JS (lightweight web framework) for API handling, Drizzle ORM for database interactions, SQLite for data storage
- GNOME-Extension: GNOME-Extension app build with https://gjs.guide

## Repository Structure

### Apps

- `apps/`
  - `backend/`: Hono.js server handling clipboard synchronization API with Drizzle ORM and LibSQL database. Read `/apps/backend/AGENTS.md` file if editing this folder
  - `gnome-extension/`: The client app for GNOME monitoring clipboard changes and communicating with the server. Read `/apps/gnome-extension/AGENTS.md` file if editing this folder

### Packages

- `packages/`
  - `database`: Database schema definitions.
  - `eslint-config/`: Base ESLint configuration for the monorepo.
  - `types/`: Shared TypeScript type definitions.
  - `typescript-config/`: Base TypeScript configuration.

## Development

Root level command:

- Format code: `pnpm run format`
- Lint code: `pnpm run lint`
- Type-check TypeScript: `pnpm run tsc`

## Architecture Notes

Every "app clients" listens for clipboard changes on the local machine and sends the content to the Hono.js server via HTTP API.
The server validates the user key, stores the clipboard data in LibSQL database, and enables synchronization across devices.

## Agent Guardrails

- Always modify `AGENTS.md` and `README.md` to keep them in sync with the new changes
- Never modify `LICENSE`, or configuration files without review.
- Never edit `package.json` file to add dependencies, always run the install command: `pnpm add <...deps>`
- Limit API rate to prevent abuse.
- Avoid hardcoding; use environment variables.
- Require human review for production deployments.
