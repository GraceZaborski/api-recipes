import { IsString, MaxLength, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserDTO {
  @Expose()
  @IsString()
  @ApiProperty()
  id: string;

  @Expose()
  @IsString()
  @ApiProperty()
  @MaxLength(255)
  name: string;
}

@Exclude()
export class UserListDTO {
  @Expose()
  @IsArray()
  @Type(() => UserDTO)
  @ApiProperty({ type: [UserDTO] })
  users: UserDTO[];
}
