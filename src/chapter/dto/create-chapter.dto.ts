import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @Expose()
  @IsNotEmpty({ message: 'Story không được để trống' })
  story: number;

  @Expose()
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @Expose()
  title?: string;

  @Expose()
  @IsNotEmpty({ message: 'Content không được để trống' })
  content: string;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
