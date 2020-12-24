import { hash } from 'bcryptjs';
import validator from 'validator';
import { i18n } from '../../i18n';
import { InterfaceToSchema, SchemaLayer } from '../types';
import { createSchema } from '../util';
import { AccountDocument } from './model';

export type AccountSchemaType = SchemaLayer<{
  email: string;
  password: string;
}>;

export const accountSchemaDefinition: InterfaceToSchema<AccountSchemaType> = {
  email: {
    index: true,
    required: [true, i18n('db.Account.errors.emailRequired')],
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: i18n('db.Account.errors.emailInvalid'),
    },
  },
  password: {
    required: [true, i18n('db.Account.errors.passwrodRequired')],
    type: String,
    validate: [
      {
        validator(value: string) {
          return value.length >= 8;
        },
        message: i18n('db.Account.errors.passwordRequire8Chars'),
      },
      {
        validator(value: string) {
          return /\d/.test(value);
        },
        message: i18n('db.Account.errors.passwordRequireANumber'),
      },
      {
        validator(value: string) {
          return /[A-Z]/.test(value);
        },
        message: i18n('db.Account.errors.passwordRequireAnUpper'),
      },
    ],
  },
};

export const AccountSchema = createSchema(accountSchemaDefinition, undefined, {
  'email_1 dup key': i18n('db.Account.errors.emailDuplicated'),
});

AccountSchema.pre('save', async function preSave(this: AccountDocument, next) {
  if (this.isNew) {
    this.password = await hash(this.password, 10);
  }

  next();
});
