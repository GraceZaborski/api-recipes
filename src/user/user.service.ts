import { Injectable } from '@nestjs/common';
import { proto } from '@beamery/chimera-user-client';

@Injectable()
export class UserService {
  constructor(private chimera: proto.User) {}

  public async getUser({ id, companyId }) {
    const authorization = {
      userId: id,
      companyId,
    };

    const request = proto.GetUserRequest.fromObject({
      authorization,
      id,
      company_id: authorization.companyId,
    });

    const { user } = await this.chimera.getUser(request);

    return user;
  }
}
