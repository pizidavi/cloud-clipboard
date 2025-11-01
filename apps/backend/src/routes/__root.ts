import { HTTP_STATUS, SERVER_ERROR } from '@repo/types';
import { requestId } from 'hono/request-id';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { env } from '../configs/env';
import { logger } from '../middlewares/logger.middleware';
import { Exception } from '../types/error';
import { createApp } from '../utils/route';
import clipboardRoutes from './clipboard.route';

const api = createApp();

// Middlewares
api.use(requestId());
api.use(logger({ name: 'api' }));

// Routes
export const routes = api.route('/', clipboardRoutes);

// Handle
api.notFound(c => {
  return c.json({ message: 'Path does not exists' }, HTTP_STATUS.NOT_FOUND);
});

api.onError((error, c) => {
  const status = 'status' in error ? error.status : undefined;

  const statusCode =
    typeof status === 'number'
      ? (status as ContentfulStatusCode)
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const code = error instanceof Exception ? error.code : SERVER_ERROR.UNKNOWN_ERROR;
  const message = error instanceof Exception ? error.message : 'Internal server error';
  const stack = !(error instanceof Exception) && 'stack' in error ? error.stack : undefined;

  return c.json(
    {
      code,
      message,
      stack: env.ENV === 'development' ? stack : undefined,
    },
    statusCode,
  );
});

export default api;
