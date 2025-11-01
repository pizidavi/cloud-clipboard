import type { ClipboardResponse } from '@repo/types';

export const clipboardObjectToEntity = (item: {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): ClipboardResponse => ({
  content: item.content,
  createdAt: item.createdAt.getTime(),
  updatedAt: item.updatedAt.getTime(),
});

export const multipleClipboardObjectToEntity = (
  items: Parameters<typeof clipboardObjectToEntity>[0][],
): ClipboardResponse[] => items.map(clipboardObjectToEntity);
