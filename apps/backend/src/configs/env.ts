import { envSchema } from '../types/schema';

export const env = (() => {
  const _ = envSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ignore this
    process.env,
  );
  if (!_.success) throw new Error(`Invalid environment variables: ${_.error.message}`);
  return _.data;
})();
