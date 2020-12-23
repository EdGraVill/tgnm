import { staticsAdditor } from '../util';
import { AccountDocument, AccountModel, getAccountModel } from './model';

export const addAccountStatics = staticsAdditor<AccountDocument, AccountModel>({
  async register({ email, password }) {
    const AccountModel = getAccountModel();

    const ProtoAccount = new AccountModel({ email, password });

    return ProtoAccount.save();
  },
});
