import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateStoryDto {
  @Expose()
  @IsNotEmpty({ message: 'Title không được để trống!' })
  title: string;

  @Expose()
  @IsNotEmpty({ message: 'Author không được để trống!' })
  author: number;

  @Expose()
  @IsNotEmpty({ message: 'Description không được để trống!' })
  description: string;

  @Expose()
  @IsNotEmpty({ message: 'Category không được để trống' })
  category: number[];

  @Expose()
  @IsNotEmpty({ message: 'Status không được để trống' })
  status: number;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
