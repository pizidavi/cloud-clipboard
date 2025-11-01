import { AUTH_ERROR, HTTP_STATUS, userKeySchema } from '@repo/types';
import { createMiddleware } from 'hono/factory';
import { Exception } from '../types/error';

type ValidateUserEnv = {
  Variables: {
    userKey: string;
  };
};

export const validateUserKey = createMiddleware<ValidateUserEnv>(async (c, next) => {
  const key = c.req.header('X-User-Key');

  if (!key)
    throw new Exception(
      HTTP_STATUS.BAD_REQUEST,
      AUTH_ERROR.USER_KEY_MISSING,
      'User key is required',
    );

  const validation = userKeySchema.safeParse(key);
  if (!validation.success)
    throw new Exception(HTTP_STATUS.BAD_REQUEST, AUTH_ERROR.USER_KEY_INVALID, 'Invalid user key');

  // Set userKey on context
  c.set('userKey', key);

  return next();
});
