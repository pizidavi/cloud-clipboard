import { z } from 'zod';

export const envSchema = z.object({
  ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
});
