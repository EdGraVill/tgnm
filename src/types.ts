import { NextApiRequest, NextApiResponse } from 'next';
import { SessionDocument } from './db';

export type CTX = {
  req: NextApiRequest & { session: SessionDocument | null };
  res: NextApiResponse;
};
