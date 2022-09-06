import { createClient, proto } from '@beamery/chimera-user-client';

export class UserClientOptions {
  userChimeraServiceEndpoint?: string;
}

export const UserChimeraClient = {
  provide: proto.User,
  useFactory: async (options: UserClientOptions) =>
    createClient(options.userChimeraServiceEndpoint),
  inject: [UserClientOptions],
};
