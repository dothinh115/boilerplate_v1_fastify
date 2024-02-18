import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { Expose, plainToClass } from 'class-transformer';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @Expose()
  story?: number;

  @Expose()
  name?: string;

  @Expose()
  title?: string;

  @Expose()
  content?: string;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
