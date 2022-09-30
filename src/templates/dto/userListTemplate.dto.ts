import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class HydratedUser {
  @Expose()
  @IsString()
  @ApiProperty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  name: string;
}

class UserDTO {
  @Expose()
  @IsString()
  @ApiProperty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  companyId: string;

  @Expose()
  @Type(() => HydratedUser)
  @ApiProperty({ type: HydratedUser })
  user: HydratedUser;
}

@Exclude()
export class UserListDTO {
  @Expose()
  @IsArray()
  @Type(() => UserDTO)
  @ApiProperty({ type: [UserDTO] })
  users: UserDTO[];
}
