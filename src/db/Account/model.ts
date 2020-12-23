import { Document, Model } from 'mongoose';
import { AccountSchema, AccountSchemaType } from './schema';
import { modelGetter } from '../util';
import { addAccountMethods } from './methods';
import { addAccountStatics } from './statics';

addAccountMethods(AccountSchema);
addAccountStatics(AccountSchema);

export interface AccountDocument extends Document, AccountSchemaType {
  changePassword(oldPassword: string, newPassword: string): Promise<AccountDocument>;
}

export interface AccountModel extends Model<AccountDocument> {
  register(accountData: Omit<AccountSchemaType, 'timestamps'>): Promise<AccountDocument>;
}

export const accountModelName = 'Account';

export const getAccountModel = modelGetter<AccountDocument, AccountModel>(accountModelName, AccountSchema);
