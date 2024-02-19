import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Expose, plainToClass } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Expose()
  email?: string;
  @Expose()
  password?: string;
  @Expose()
  role?: string;
  @Expose()
  actived?: boolean;
  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
