import { z } from 'zod';

export const updateClipboardRequestSchema = z.object({
  content: z.string().min(1),
});

export type UpdateClipboardRequest = z.infer<typeof updateClipboardRequestSchema>;
