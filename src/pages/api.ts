/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphqlHTTP } from 'express-graphql';
import { connectToDB, getSessionModel } from '../db';
import { getSchema } from '../gql';
import { LangPath, langPathList, loadLocale } from '../i18n';
import { CTX } from '../types';
import { ERROR_SEPARATOR, isProdEnv } from '../util';

export default async (req: CTX['req'], res: CTX['res']) => {
  await connectToDB();
  await getSessionModel().restoreSession({ req, res });

  const i18n = await loadLocale(req.query['__nextLocale'] as any);

  return graphqlHTTP({
    schema: getSchema({ req, res }),
    context: { req, res },
    graphiql: !isProdEnv,
    customFormatErrorFn(error) {
      const messages = error.message.split(ERROR_SEPARATOR);

      error.message = messages
        .map((message) => {
          try {
            const args: Parameters<typeof i18n> = JSON.parse(message);

            if (langPathList.includes(args[0])) {
              return i18n(...args);
            }

            console.error(args[0]);
            return i18n('common.unexpectedError');
          } catch (error) {
            if (langPathList.includes(message)) {
              return i18n(message as LangPath);
            }

            console.error(message);
            return i18n('common.unexpectedError');
          }
        })
        .join('. ');
      error.message += '.';

      return error;
    },
  })(req as any, res);
};
