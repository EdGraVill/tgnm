import { NextApiRequest, NextApiResponse } from 'next';
import { SessionDocument } from './db';

export type CTX = {
  req: NextApiRequest & { session: SessionDocument | null };
  res: NextApiResponse;
};

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? string extends F
      ? string
      : `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DottedLanguageObjectStringPaths<O extends Record<string, any>> = Join<PathsToStringProps<O>, '.'>;
