import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from '../types/user.js';
import { IProfile } from '../types/profile.js';

// loader types and interfaces
type IDataLoader = DataLoader<string, unknown | undefined>;

export interface ILoaders {
  user: IDataLoader;
  profile: IDataLoader;
}

export interface IContext {
  db: PrismaClient;
  loaders: ILoaders;
}

// unifying dataloader
export const createDataLoaders = (db: PrismaClient): ILoaders => {
  return {
    user: createUserDataLoader(db),
    profile: createProfileDataLoader(db),
  }
}

// user dataloader 
const createUserDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IUser | undefined>(async (keys: readonly string[]) => {
    return await db.user.findMany({
      where: { id: { in: keys as string[] } },
    });
  });
};

// profile dataloader 
const createProfileDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IProfile | undefined>(async (keys: readonly string[]) => {
    return await db.profile.findMany({
      where: { id: { in: keys as string[] | undefined } },
    });
  });
};