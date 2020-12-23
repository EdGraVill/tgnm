import { GraphQLBoolean, GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { AccountModel, getAccountModel } from '../../db';
import { CTX } from '../../types';

export type RegisterMutationArgs = Parameters<AccountModel['register']>[0];

export const RegisterMutation: GraphQLFieldConfig<Record<string, never>, CTX, RegisterMutationArgs> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(src, { email, password }) {
    await getAccountModel().register({ email, password });

    return true;
  },
};

export type ChangePasswordMutationArgs = { oldPassword: string; newPassword: string };

export const ChangePasswordMutation: GraphQLFieldConfig<Record<string, never>, CTX, ChangePasswordMutationArgs> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    oldPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
    newPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(src, { newPassword, oldPassword }, ctx) {
    const Account = await ctx.req.session.getAccount();

    await Account.changePassword(oldPassword, newPassword);

    return true;
  },
};
