import { getAccountModel } from '../Account';
import { methodsAdditor } from '../util';
import { getSessionModel, SessionDocument } from './model';
import { SessionSchemaType } from './schema';

export const addSessionMethods = methodsAdditor<SessionSchemaType, SessionDocument>({
  async closeAllSessions() {
    const accountId = this.accountId;

    const SessionModel = getSessionModel();

    await SessionModel.updateMany({ account: accountId, isActive: true }, { isActive: false });
  },
  async closeCurrentSession() {
    await this.updateOne({ isActive: false });
  },
  async getAccount(lean?: boolean) {
    if (lean) {
      return getAccountModel().findById(this.accountId).lean();
    } else {
      return getAccountModel().findById(this.accountId);
    }
  },
});
