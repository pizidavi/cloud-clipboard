import { users } from '@repo/database';
import { eq } from 'drizzle-orm';
import { db } from '../configs/database';

export const userRepository = () => {
  const getUserByKey = async (key: string) => {
    const result = await db.select().from(users).where(eq(users.key, key)).limit(1);
    return result.at(0);
  };

  const getOrCreateUser = async (key: string) => {
    let user = await getUserByKey(key);
    user ??= await createUser(key);
    return user;
  };

  const createUser = async (key: string) => {
    const [user] = await db.insert(users).values({ key }).returning();
    return user;
  };

  return {
    getUserByKey,
    getOrCreateUser,
    createUser,
  };
};
