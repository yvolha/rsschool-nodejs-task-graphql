import { PrismaClient } from '@prisma/client';

import DataLoader from 'dataloader';

type IDataLoader = DataLoader<string, unknown>;

export interface Loaders {
  user: IDataLoader;
}

export interface Context {
  db: PrismaClient;
  loaders: Loaders;
}