import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { proto } from '@beamery/chimera-user-client';

describe('UserService', () => {
  let service: UserService;
  let userClient: proto.User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: proto.User,
          useValue: {
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userClient = module.get<proto.User>(proto.User);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to request a user', async () => {
    const user = { id: 'userId', companyId: 'companyId' };
    jest.spyOn(userClient, 'getUser').mockImplementation(
      () =>
        ({
          user,
        } as any),
    );

    const request = proto.GetUserRequest.fromObject({
      authorization: {
        userId: user.id,
        companyId: user.companyId,
      },
      id: user.id,
      company_id: user.companyId,
    });

    const result = await service.getUser({
      id: user.id,
      companyId: user.companyId,
    });
    expect(result).toEqual(user);

    expect(userClient.getUser).toBeCalledWith(request);
  });
});
