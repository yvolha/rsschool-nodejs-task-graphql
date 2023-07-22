import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import { IUser } from './types/user.js';
import { Context } from './dataloader/dataloaders.js';
import { IProfile } from './types/profile.js';

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: UUIDType},
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
  })
})

export const UserQueries = {
  user: {
    type: UserType,
    args: {id: {type: UUIDType}},
    resolve: async (_, { id }: IUser, { loaders }: Context) =>
    await loaders.user.load(id),
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
  })
})

export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: {id: {type: UUIDType}},
    resolve: async (_, { id }: IProfile, { loaders }: Context) =>
    await loaders.profile.load(id),
  }
}

export const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQueries,
  }
})
