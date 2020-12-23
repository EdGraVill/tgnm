import { graphqlHTTP } from 'express-graphql';
import { connectToDB, getSessionModel } from '../db';
import { getSchema } from '../gql';
import { CTX } from '../types';
import { isProdEnv } from '../util';

export default async (req: CTX['req'], res: CTX['res']) => {
  await connectToDB();
  await getSessionModel().restoreSession({ req, res });

  return graphqlHTTP({
    schema: getSchema({ req, res }),
    context: { req, res },
    graphiql: !isProdEnv,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })(req as any, res);
};
