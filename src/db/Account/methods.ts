import { compare } from 'bcryptjs';
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

      throw new Error('Wrong password');
    }

    this.password = newPassword;

    return this.save();
  },
});
