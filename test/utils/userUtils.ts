import * as sinon from 'sinon';
import { proto } from '@beamery/chimera-user-client';

type StubResponse = {
  error?: proto.IError;
  id?: string;
  companyId?: string;
  firstName?: string;
  lastName?: string;
};

export const userSandbox = sinon.createSandbox();
export const userStub = userSandbox.createStubInstance(proto.User);

export const stubUserResponse = (user: StubResponse) =>
  userStub.getUser.resolves(proto.GetUserResponse.fromObject({ user }));
