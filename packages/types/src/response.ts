import { z } from 'zod';

export const clipboardResponseSchema = z.object({
  content: z.string().min(1),
  createdAt: z.number().min(0),
  updatedAt: z.number().min(0),
});

export type ClipboardResponse = z.infer<typeof clipboardResponseSchema>;
