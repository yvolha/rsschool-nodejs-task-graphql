import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from '../types/user.js';
import { IProfile } from '../types/profile.js';

type IDataLoader = DataLoader<string, unknown | undefined>;

export interface Loaders {
  user: IDataLoader;
  profile: IDataLoader;
}

export interface Context {
  db: PrismaClient;
  loaders: Loaders;
}

export const createDataLoaders = (db: PrismaClient): Loaders => {
  return {
    user: createUserDataLoader(db),
    profile: createProfileDataLoader(db),
  }
}

const createUserDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IUser | undefined>(async (keys: readonly string[]) => {
    return await db.user.findMany({
      where: { id: { in: keys as string[] } },
    });
  });
};

const createProfileDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IProfile | undefined>(async (keys: readonly string[]) => {
    return await db.profile.findMany({
      where: { id: { in: keys as string[] } },
    });
  });
};