import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserChimeraClient,
  UserClientOptions,
} from './auth-user.client/auth-user.client';

@Module({
  providers: [
    { provide: UserClientOptions, useValue: {} },
    UserChimeraClient,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
