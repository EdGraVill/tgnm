import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { CTX } from '../../types';
import { GraphQLSession } from './types';

export const UserAgentQuery: GraphQLFieldConfig<Record<string, never>, CTX> = {
  type: new GraphQLNonNull(GraphQLString),
  resolve(src, args, ctx) {
    return ctx.req.headers['user-agent'];
  },
};

export const MySessionQuery: GraphQLFieldConfig<Record<string, never>, CTX> = {
  type: new GraphQLNonNull(GraphQLSession),
  resolve(src, args, ctx) {
    return ctx.req.session;
  },
};
