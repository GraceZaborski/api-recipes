import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export interface Response<T> {
  data: T;
}

export function HydrateUserDataInterceptorFactory({
  idPropertyName,
  collectionPath = null,
}: {
  idPropertyName: string;
  collectionPath?: string;
}) {
  @Injectable()
  class HydrateUserDataInterceptor<T>
    implements NestInterceptor<T, Response<T>>
  {
    constructor(public userService: UserService) {}

    async hydrateUserData(data: any[]) {
      const path = collectionPath ? data[collectionPath] : data;
      return await Promise.all(
        path.map((item) =>
          this.getHydratedUserData(item, item[idPropertyName], item.companyId),
        ),
      );
    }

    async getHydratedUserData(item: any, id: string, companyId: string) {
      const userData = await this.userService.getUser({ id, companyId });

      if (userData && userData.firstName) {
        return {
          ...item,
          user: {
            id,
            name: `${userData.firstName} ${userData.lastName}`,
          },
        };
      }

      return item;
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      try {
        return next.handle().pipe(
          map(async (data) => {
            const hydratedData = await this.hydrateUserData(data);
            return collectionPath
              ? {
                  ...data,
                  [collectionPath]: hydratedData,
                }
              : hydratedData;
          }),
        );
      } catch (e) {
        console.log(`Error while hydrating user data, error: `, e.message);
      }
    }
  }

  return mixin(HydrateUserDataInterceptor);
}
