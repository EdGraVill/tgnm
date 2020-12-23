import { compare } from 'bcryptjs';
import { parse, serialize } from 'cookie';
import { sign, verify } from 'jsonwebtoken';
import NodeRSA from 'node-rsa';
import { getAccountModel } from '../Account';
import { staticsAdditor } from '../util';
import { SessionDocument, SessionModel } from './model';

export const addSessionStatics = staticsAdditor<SessionDocument, SessionModel>({
  async login(credentials, ctx) {
    const Account = await getAccountModel().findOne({ email: credentials.email });

    if (!Account) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('Wrong email');
      }

      throw new Error('Wrong credentials');
    }

    const isRightPassword = await compare(credentials.password, Account.password);

    if (!isRightPassword) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('Wrong password');
      }

      throw new Error('Wrong credentials');
    }

    const keystore = new NodeRSA({ b: 1024 });
    const privateKey = keystore.exportKey('private');
    const publicKey = keystore.exportKey('public');
    const ninetyDaysFromNow = Date.now() + 90 * 24 * 60 * 60 * 1000;

    const jwt = await sign({ publicKey }, privateKey, { algorithm: 'RS256', expiresIn: ninetyDaysFromNow });

    const NewSession = new this({
      RSA: {
        privateKey,
        publicKey,
      },
      accountId: Account._id,
      jwt,
      userAgent: ctx.req.headers['user-agent'],
    });

    const Session = await NewSession.save();

    ctx.req.session = Session;
    ctx.res.setHeader(
      'Set-Cookie',
      serialize('jwt', jwt, {
        path: '/',
        maxAge: ninetyDaysFromNow,
      }),
    );
  },
  async restoreSession(ctx) {
    let jwt: string | null = null;

    if (ctx.req.headers.cookie) {
      const cookies = parse(ctx.req.headers.cookie);

      if (!cookies.jwt) {
        return;
      }

      jwt = cookies.jwt;
    } else if (ctx.req.headers.authorization && ctx.req.headers.authorization.match(/Bearer\s.*/g)) {
      jwt = ctx.req.headers.authorization.replace('Bearer ', '');
    }

    if (jwt === null) {
      return;
    }

    if (jwt === '') {
      // Token is wrong, remove cookie
      ctx.res.setHeader('Set-Cookie', serialize('jwt', '', { maxAge: -1, path: '/' }));

      return;
    }

    const Session = await this.findOne({ jwt, isActive: true });

    if (!Session) {
      // There's a proble searching the Session or is inactive, remove cookie
      ctx.res.setHeader('Set-Cookie', serialize('jwt', '', { maxAge: -1, path: '/' }));

      return;
    }

    try {
      // test JWT
      verify(jwt, Session.RSA.publicKey);

      await Session.updateOne({ lastConnection: new Date() });

      ctx.req.session = Session;
    } catch (error) {
      // There's a problem with JWT, remove cookie
      ctx.res.setHeader('Set-Cookie', serialize('jwt', '', { maxAge: -1, path: '/' }));

      return;
    }
  },
});
