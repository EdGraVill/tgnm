/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlHTTP } from 'express-graphql';
import { connectToDB, getSessionModel } from '../db';
import { getSchema } from '../gql';
import { langPathList, loadLocale } from '../i18n';
import { CTX } from '../types';
import { isProdEnv } from '../util';

export default async (req: CTX['req'], res: CTX['res']) => {
  await connectToDB();
  await getSessionModel().restoreSession({ req, res });

  const i18n = await loadLocale(req.query['__nextLocale'] as any);

  return graphqlHTTP({
    schema: getSchema({ req, res }),
    context: { req, res },
    graphiql: !isProdEnv,
    customFormatErrorFn(error) {
      if (langPathList.includes(error.message)) {
        error.message = i18n(error.message as any);
      } else {
        console.error(error.message);
        error.message = i18n('common.unexpectedError');
      }

      return error;
    },
  })(req as any, res);
};
