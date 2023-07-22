import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import { IUser } from './types/user.js';
import { IContext } from './dataloader/dataloaders.js';
import { IProfile } from './types/profile.js';

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: UUIDType},
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},

    profile: {
      type: ProfileType,
      resolve: async ({ id }: IUser, _args, { loaders }: IContext) =>
      await loaders.profile.load(id),
    }
  })
})

export const UserQueries = {
  user: {
    type: UserType,
    args: {id: {type: UUIDType}},
    resolve: async (_, { id }: IUser, { loaders }: IContext) =>
    await loaders.user.load(id),
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async () => {
      
    }
  }
}

export const ProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: {type: UUIDType},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    userId: {type: UUIDType},
    memberTypeId: {type: GraphQLString},
    user: {
      type: UserType,
      resolve: async ({ userId }, _args, { db }: IContext) =>
        db.user.findFirst({ where: { id: userId } }),
    },
  })
})

export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: {id: {type: UUIDType}},
    resolve: async (_, { id }: IProfile, { loaders }: IContext) =>
    await loaders.profile.load(id),
  }
}

export const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQueries,
    ...ProfileQueries,
  }
})
