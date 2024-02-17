import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryDto } from './create-story.dto';
import { Expose, plainToClass } from 'class-transformer';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {
  @Expose()
  title?: string;

  @Expose()
  author?: number;

  @Expose()
  description?: string;

  @Expose()
  category?: number[];

  @Expose()
  status?: number;

  @Expose()
  source?: string;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
