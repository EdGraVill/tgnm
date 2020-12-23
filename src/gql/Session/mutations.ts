import { GraphQLBoolean, GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { getSessionModel, SessionModel } from '../../db';
import { CTX } from '../../types';

export type LoginMutationArgs = Parameters<SessionModel['login']>[0];

export const LoginMutation: GraphQLFieldConfig<Record<string, never>, CTX, LoginMutationArgs> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(src, { email, password }, ctx) {
    await getSessionModel().login({ email, password }, ctx);

    return true;
  },
};

export const CloseAllSessionsMutation: GraphQLFieldConfig<Record<string, never>, CTX> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  async resolve(src, args, ctx) {
    await ctx.req.session.closeAllSessions();

    return true;
  },
};

export const CloseCurrentSessionsMutation: GraphQLFieldConfig<Record<string, never>, CTX> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  async resolve(src, args, ctx) {
    await ctx.req.session.closeCurrentSession();

    return true;
  },
};
