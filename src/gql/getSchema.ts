import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { CTX } from '../types';
import { ChangePasswordMutation, MyAccountQuery, RegisterMutation } from './Account';
import { MySessionQuery, UserAgentQuery } from './Session';
import { CloseAllSessionsMutation, CloseCurrentSessionsMutation, LoginMutation } from './Session/mutations';

export const privateSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: () => ({
      myAccount: MyAccountQuery,
      mySession: MySessionQuery,
    }),
    name: 'GraphQLPrivateRootQuery',
  }),
  mutation: new GraphQLObjectType({
    fields: () => ({
      changePassword: ChangePasswordMutation,
      closeAllSessions: CloseAllSessionsMutation,
      closeCurrentSession: CloseCurrentSessionsMutation,
    }),
    name: 'GraphQLPrivateRootMutation',
  }),
});

export const publicSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: {
      userAgent: UserAgentQuery,
    },
    name: 'GraphQLPublicRootQuery',
  }),
  mutation: new GraphQLObjectType({
    fields: () => ({
      register: RegisterMutation,
      login: LoginMutation,
    }),
    name: 'GraphQLPublicRootMutation',
  }),
});

export const getSchema = (ctx: CTX) => {
  if (ctx.req.session) {
    return privateSchema;
  }

  return publicSchema;
};
