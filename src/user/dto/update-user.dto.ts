import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Expose } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Expose()
  email?: string;
  @Expose()
  password?: string;
  @Expose()
  role?: string;
  @Expose()
  actived?: boolean;
}
