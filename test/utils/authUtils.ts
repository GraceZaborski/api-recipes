import * as sinon from 'sinon';
import { proto } from '@beamery/chimera-auth-client';

type StubResponse = {
  error?: proto.IError;
  abilities?: string[];
  roles?: string[];
  userId?: string;
  companyId?: string;
};

export const authSandbox = sinon.createSandbox();

export const authStub = authSandbox.createStubInstance(proto.Auth);

export const stubAuthUserResponse = (userRolesAbilities: StubResponse) =>
  authStub.getUserAbilities.resolves(
    proto.GetUserAbilitiesResponse.fromObject(userRolesAbilities),
  );

export const buildXTokenPayload = ({
  companyId,
  userId,
  roles,
}: {
  companyId: string;
  userId: string;
  roles?: string[];
}) =>
  Buffer.from(
    JSON.stringify({
      companyid: companyId,
      userid: userId,
      roles: roles.join(','),
    }),
    'utf-8',
  ).toString('base64');
