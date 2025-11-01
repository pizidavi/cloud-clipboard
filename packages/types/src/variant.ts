import { z } from 'zod';

export const userKeySchema = z.string().min(16);
