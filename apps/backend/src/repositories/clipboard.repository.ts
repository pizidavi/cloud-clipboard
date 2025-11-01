import { clipboards, users } from '@repo/database';
import { eq } from 'drizzle-orm';
import { db } from '../configs/database';

export const clipboardRepository = () => {
  const getClipboard = async (key: string) => {
    const result = await db
      .select({
        userId: clipboards.userId,
        content: clipboards.content,
        updatedAt: clipboards.updatedAt,
        createdAt: clipboards.createdAt,
      })
      .from(clipboards)
      .innerJoin(users, eq(clipboards.userId, users.id))
      .where(eq(users.key, key))
      .limit(1);
    return result.at(0);
  };

  const saveClipboard = async (userId: number, content: string) => {
    // Upsert: replace the latest clipboard for the user
    await db.insert(clipboards).values({ userId, content }).onConflictDoUpdate({
      target: clipboards.userId,
      set: { content },
    });
  };

  return {
    getClipboard,
    saveClipboard,
  };
};
