import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { Expose, plainToClass } from 'class-transformer';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @Expose()
  name: string;
  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
