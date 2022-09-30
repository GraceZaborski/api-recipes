import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HydrateUserDataInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private userService: UserService) {}

  async hydrateUserData(usersData: any[]) {
    return await Promise.all(
      usersData.map((user) =>
        this.getHydratedUserData(user.id, user.companyId),
      ),
    );
  }

  async getHydratedUserData(id: string, companyId: string) {
    const userData = await this.userService.getUser({ id, companyId });

    return {
      id,
      name: `${userData.firstName} ${userData.lastName}`,
    };
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      return next.handle().pipe(
        map(async (data) => ({
          users: await this.hydrateUserData(data),
        })),
      );
    } catch (e) {
      console.log(`Error while hydrating user data, error: `, e.message);
    }
  }
}
