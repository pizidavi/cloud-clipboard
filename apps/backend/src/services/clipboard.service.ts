import { CLIPBOARD_ERROR, HTTP_STATUS } from '@repo/types';
import type { Context } from 'hono';
import { childLogger } from '../middlewares/logger.middleware';
import { clipboardRepository } from '../repositories/clipboard.repository';
import { userRepository } from '../repositories/user.repository';
import { Exception } from '../types/error';
import type { Env } from '../types/type';

export const clipboardService = (context: Context<Env>) => {
  const logger = childLogger(context, 'clipboard-service');

  const userRepo = userRepository();
  const clipboardRepo = clipboardRepository();

  // Find
  const findClipboard = async (key: string) => {
    const clipboard = await clipboardRepo.getClipboard(key);
    if (!clipboard)
      throw new Exception(
        HTTP_STATUS.NOT_FOUND,
        CLIPBOARD_ERROR.CLIPBOARD_NOT_FOUND,
        'Clipboard not found',
      );

    logger.info({ key }, 'Clipboard found');
    return clipboard;
  };

  // Update
  const updateClipboard = async (key: string, content: string) => {
    const user = await userRepo.getOrCreateUser(key);
    await clipboardRepo.saveClipboard(user.id, content);

    logger.info({ userId: user.id }, 'clipboard updated');
  };

  return {
    findClipboard,
    updateClipboard,
  };
};
