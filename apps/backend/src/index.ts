import { serve } from '@hono/node-server';
import { HTTP_STATUS } from '@repo/types';
import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { BASE_API_PATH } from './configs/constant';
import { env } from './configs/env';
import apiRoute from './routes/__root';
import { Exception } from './types/error';

const app = new Hono();

// Routes
app.route(BASE_API_PATH, apiRoute);

// Handle
app.notFound(c => {
  return c.text('Path does not exists', HTTP_STATUS.NOT_FOUND);
});

app.onError((error, c) => {
  const status = 'status' in error ? error.status : undefined;

  const statusCode =
    typeof status === 'number'
      ? (status as ContentfulStatusCode)
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error instanceof Exception ? error.message : 'Internal server error';

  return c.text(message, statusCode);
});

// Start server
const port = env.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close(err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
