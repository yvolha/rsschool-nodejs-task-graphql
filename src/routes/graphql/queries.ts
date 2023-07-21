import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: UUIDType},
    name: {type: GraphQLString},
    balance: {type: GraphQLFloat},
  })
})