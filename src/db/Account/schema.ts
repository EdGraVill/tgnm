import { hashSync } from 'bcryptjs';
import { InterfaceToSchema, SchemaLayer } from '../types';
import { createSchema } from '../util';

export type AccountSchemaType = SchemaLayer<{
  email: string;
  password: string;
}>;

export const accountSchemaDefinition: InterfaceToSchema<AccountSchemaType> = {
  email: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
  password: {
    set: (value: string) => hashSync(value),
    type: String,
  },
};

export const AccountSchema = createSchema(accountSchemaDefinition);
