import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { SessionDocument } from '../../db';
import { CTX } from '../../types';
import { GraphQLAccount } from '../Account';

export const GraphQLSession = new GraphQLObjectType<SessionDocument, CTX>({
  fields: () => ({
    publicKey: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ RSA: { publicKey } }) {
        return publicKey;
      },
    },
    Account: {
      type: new GraphQLNonNull(GraphQLAccount),
      async resolve(Session) {
        return Session.getAccount(true);
      },
    },
    jwt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ jwt }) {
        return jwt;
      },
    },
    lastConnection: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ lastConnection }) {
        return lastConnection.toISOString();
      },
    },
    userAgent: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ userAgent }) {
        return userAgent;
      },
    },
  }),
  name: 'GraphQLSessionType',
});
