import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import type pino from 'pino';
import { type Options, pinoHttp } from 'pino-http';
import { env } from '../configs/env';

const pinoHttpOptions = {
  level: 'debug',
  base: null, // Remove pid and hostname from logs
  transport:
    env.ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
  serializers: {
    req: req => ({
      id: req.id,
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        accept: req.headers.accept,
      },
    }),
    res: res => ({
      statusCode: res.statusCode,
    }),
  },
  quietReqLogger: true,
  quietResLogger: true,
} as const satisfies Options;

type LoggerConfig = {
  name: string;
};

type LoggerEnv = {
  Variables: { logger: pino.Logger };
  Bindings: any;
};

export const logger = (config: LoggerConfig) =>
  createMiddleware<LoggerEnv>(async (c, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (c.var?.logger) {
      // root logger
      c.set('logger', c.var.logger.child({ name: config.name }));
      return next();
    }

    // Pass hono's request-id to pino-http
    c.env.incoming.id = c.var.requestId;

    // Map express style middleware to hono
    await new Promise<void>(resolve => {
      pinoHttp(pinoHttpOptions)(c.env.incoming, c.env.outgoing, () => resolve());
    });

    // Set logger on context
    c.set('logger', c.env.incoming.log);

    const logger = c.env.incoming.log;
    logger.info(
      {
        request: {
          method: c.req.method,
          path: c.req.path,
        },
      },
      'request begin',
    );

    await next();
  });

export const childLogger = (context: Context, name: string) =>
  (context.var.logger as pino.Logger).child({ name });
