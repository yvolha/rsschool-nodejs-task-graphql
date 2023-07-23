import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import { IUser } from './types/user.js';
import { IContext } from './dataloader/dataloaders.js';
import { IProfile } from './types/profile.js';
import { IMemberType } from './types/memberType.js';
import { IPost } from './types/post.js';

// user type and queries
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: UUIDType},
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},

    profile: {
      type: ProfileType,
      resolve: async ({ id }: IUser, _args, { db }: IContext) =>
      await db.profile.findFirst({ where: { userId: id } }),
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
    resolve: async (_obj, _args, { db }: IContext) => {
      return await db.user.findMany();
    }
  }
}

// profile type and queries
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
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_obj, _args, { db }: IContext) => {
      return await db.profile.findMany();
    }
  }
}

// memberType type and query

export const MemberTypeType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: {type: GraphQLString},
    discount: {type: GraphQLFloat},
    postsLimitPerMonth: {type: GraphQLInt},
  })
})

export const MemberTypeQueries = {
  memberType: {
    type: MemberTypeType,
    args: {id: {type: GraphQLString},},
    resolve: async (_, { id }: IMemberType, { loaders }: IContext) =>
    await loaders.memberType.load(id),
  },

  memberTypes: {
    type: new GraphQLList(MemberTypeType),
    resolve: async (_obj, _args, { db }: IContext) => {
      return await db.memberType.findMany();
    }
  }
}

// posts type and query

export const PostType = new GraphQLObjectType({
  name: "PostType",
  fields: () => ({
    id: {type: UUIDType},
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    authorId: {type: UUIDType},
  })
})

export const PostQueries = {
  post: {
    type: PostType,
    args: {id: {type: UUIDType}},
    resolve: async (_, { id }: IPost, { loaders }: IContext) =>
    await loaders.post.load(id),
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (_obj, _args, { db }: IContext) => {
      return await db.post.findMany();
    }
  }
}

// root query
export const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQueries,
    ...ProfileQueries,
    ...PostQueries,
    ...MemberTypeQueries,
  }
})
