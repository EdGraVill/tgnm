import { Types } from 'mongoose';
import { accountModelName } from '../Account';
import { InterfaceToSchema, SchemaLayer } from '../types';
import { createSchema } from '../util';

export type SessionSchemaType = SchemaLayer<{
  RSA: {
    privateKey: string;
    publicKey: string;
  };
  accountId: Types.ObjectId;
  isActive: boolean;
  jwt: string;
  lastConnection: Date;
  userAgent: string;
}>;

export const sessionSchemaDefinition: InterfaceToSchema<SessionSchemaType> = {
  RSA: {
    privateKey: {
      required: true,
      type: String,
    },
    publicKey: {
      required: true,
      type: String,
    },
  },
  accountId: {
    ref: accountModelName,
    required: true,
    type: Types.ObjectId,
  },
  isActive: {
    default: true,
    type: Boolean,
  },
  jwt: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
  lastConnection: {
    default: Date.now(),
    required: true,
    type: Date,
  },
  userAgent: {
    default: '',
    required: true,
    type: String,
  },
};

export const SessionSchema = createSchema(sessionSchemaDefinition);
