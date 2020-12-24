import { compare, hash } from 'bcryptjs';
import { i18n } from '../../i18n';
import { isProdEnv } from '../../util';
import { methodsAdditor } from '../util';
import { AccountDocument } from './model';
import { AccountSchemaType } from './schema';

export const addAccountMethods = methodsAdditor<AccountSchemaType, AccountDocument>({
  async changePassword(oldPassword: string, newPassword: string) {
    const isRightPassword = await compare(oldPassword, this.password);

    if (!isRightPassword) {
      if (!isProdEnv) {
        console.log('Wrong password');
      }

      throw new Error(i18n('db.Account.errors.wrongPassword'));
    }

    if (newPassword.length < 8) {
      throw new Error(i18n('db.Account.errors.passwordRequire8Chars'));
    }

    if (!/\d/.test(newPassword)) {
      throw new Error(i18n('db.Account.errors.passwordRequireANumber'));
    }

    if (!/[A-Z]/.test(newPassword)) {
      throw new Error(i18n('db.Account.errors.passwordRequireAnUpper'));
    }

    this.password = await hash(newPassword, 10);

    return this.save();
  },
});
