import { Document, DocumentDefinition, Model } from 'mongoose';
import { SessionSchema, SessionSchemaType } from './schema';
import { CTX } from '../../types';
import { AccountDocument } from '../Account';
import { modelGetter } from '../util';
import { addSessionMethods } from './methods';
import { addSessionStatics } from './statics';

addSessionMethods(SessionSchema);
addSessionStatics(SessionSchema);

export interface SessionDocument extends Document, SessionSchemaType {
  closeAllSessions(): Promise<void>;
  closeCurrentSession(): Promise<void>;
  getAccount(lean?: false): Promise<AccountDocument>;
  getAccount(lean: true): Promise<DocumentDefinition<AccountDocument>>;
}

export interface SessionModel extends Model<SessionDocument> {
  login(credentials: { email: string; password: string }, ctx: CTX): Promise<void>;
  restoreSession(ctx: CTX): Promise<void>;
}

export const sessionModelName = 'Session';

export const getSessionModel = modelGetter<SessionDocument, SessionModel>(sessionModelName, SessionSchema);
