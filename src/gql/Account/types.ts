import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AccountDocument, AccountSchemaType } from '../../db';
import { CTX } from '../../types';

export type AccountType = Pick<AccountSchemaType, 'email'>;

export const GraphQLAccount = new GraphQLObjectType<AccountDocument, CTX>({
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve({ email }) {
        return email;
      },
    },
  }),
  name: 'GraphQLAccountType',
});
