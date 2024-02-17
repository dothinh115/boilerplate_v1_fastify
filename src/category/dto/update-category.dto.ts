import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Expose, plainToClass } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Expose()
  title: string;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
