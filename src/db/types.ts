/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Model, Schema, SchemaType, SchemaTypeOpts } from 'mongoose';

export interface Timestamps {
  created: Date;
  updated: Date;
}

export type InterfaceToSchema<I> = {
  [K in keyof Required<Omit<I, 'timestamps'>>]: Required<Omit<I, 'timestamps'>>[K] extends Date
    ? SchemaTypeOpts<DateConstructor | number> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends (infer R)[]
    ? R extends Schema.Types.ObjectId | Document
      ? SchemaTypeOpts<any[]> | Schema | SchemaType
      : R extends Record<string, unknown>
      ? Array<InterfaceToSchema<R>>
      : SchemaTypeOpts<any[]> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends Schema.Types.ObjectId | Document
    ? SchemaTypeOpts<any> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends Record<string, unknown>
    ? InterfaceToSchema<Required<Omit<I, 'timestamps'>>[K]>
    : SchemaTypeOpts<any> | Schema | SchemaType;
};

export type SchemaLayer<S extends Record<string, any>> = S & {
  timestamps: Timestamps;
};

export type ExtractMethods<S extends SchemaLayer<Record<string, unknown>>, D extends Document> = {
  // @ts-ignore
  [M in keyof Omit<Omit<D, keyof S>, keyof Document>]: (this: D, ...args: Parameters<D[M]>) => ReturnType<D[M]>;
};

export type ExtractStatics<D extends Document, M extends Model<D>> = {
  // @ts-ignore
  [S in keyof Omit<M, keyof Model<Document>>]: (this: M, ...args: Parameters<M[S]>) => ReturnType<M[S]>;
};
