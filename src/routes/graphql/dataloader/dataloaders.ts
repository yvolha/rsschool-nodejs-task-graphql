import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from '../types/user.js';
import { IProfile } from '../types/profile.js';
import { IMemberType } from '../types/memberType.js';
import { IPost } from '../types/post.js';

// loader types and interfaces
type IDataLoader = DataLoader<string, unknown | undefined>;

export interface ILoaders {
  user: IDataLoader;
  profile: IDataLoader;
  memberType: IDataLoader;
  post: IDataLoader;
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
    memberType: createMemberTypeDataLoader(db),
    post: createPostsDataLoader(db),
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
      where: { id: { in: keys as string[] } },
    });
  });
};

// memberType dataloader
const createMemberTypeDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IMemberType | undefined>(async (keys: readonly string[]) => {
    return await db.memberType.findMany({
      where: { id: { in: keys as string[] } },
    });
  });
};

// post dataloader
const createPostsDataLoader = (db: PrismaClient) => {
  return new DataLoader<string, IPost | undefined>(async (keys: readonly string[]) => {
    return await db.post.findMany({
      where: { id: { in: keys as string[] } },
    });
  });
};