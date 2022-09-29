import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export function HydrateUser(field: string): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    userService: UserService;
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      return next.handle().pipe(
        map(async (user) => {
          const userData = await this.userService.getUser({
            id: user[field],
            companyId: '',
          });

          return {
            userId: user.userId,
            userName: userData.firstName,
          };
        }),
      );
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
