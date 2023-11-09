import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @Expose()
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
