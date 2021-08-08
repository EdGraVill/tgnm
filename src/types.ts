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

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
type Push<T extends any[], V> = [...T, V];
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>;
