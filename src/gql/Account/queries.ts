import { GraphQLFieldConfig } from 'graphql';
import { getAccountModel } from '../../db';
import { CTX } from '../../types';
import { getSelectedFields } from '../util';
import { GraphQLAccount } from './types';

export const MyAccountQuery: GraphQLFieldConfig<Record<string, never>, CTX> = {
  type: GraphQLAccount,
  async resolve(src, args, ctx, info) {
    const selection = getSelectedFields(info);

    const Account = await getAccountModel().findById(ctx.req.session.accountId).select(selection).lean();

    return Account;
  },
};
