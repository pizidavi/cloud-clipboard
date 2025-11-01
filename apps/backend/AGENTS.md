# Project overview

This is the backend that store the latest `clipboard` content

## Architecture

### Database

The backend uses Drizzle ORM with LibSQL (SQLite-compatible) to store the latest clipboard content for each user. The database schema includes tables for users (identified by a unique KEY) and clipboard entries.

### User Management

The backend supports multiple users, each represented by a randomly generated string KEY. Clients authenticate using the KEY in the `X-User-Key` header or `key` query parameter. No username or password is required; the KEY serves as the sole identifier for user sessions and data isolation.

## Data Flow

Request → Validate user key → Validate body (for POST) → Execute database operation → Reply

## API Endpoints

- `POST /api/clipboard`: Update clipboard content. Requires `X-User-Key` header and JSON body with `content`.
- `GET /api/clipboard`: Retrieve latest clipboard content. Requires `X-User-Key` header.

## Project structure

- `configs`: constants, environment variables, and database configuration
- `factories`: function to create return object
- `middlewares`: middlewares for service injection and user validation
- `repositories`: function to handle database query and data
- `routes`: API route definitions with validation
- `services`: business logic for routes operations
- `types`: TypeScript types, schemas, and database schema definitions
- `utils`: utility functions for creating Hono apps and routes

### Key Patterns

- **Service Injection**: Use `registerService` middleware to inject services into `c.var`
- **Error Handling**: Throw `Exception` with HTTP status and Error code from `@repo/types` for errors
- **Validation**: Zod schemas in `@repo/types` for requests, and responses

### Conventions

- **File Structure**: Group by purpose (routes, services, repositories, middlewares, utils)
- **Async/Await**: All I/O operations async; use Promise.resolve().then() for error handling chains
