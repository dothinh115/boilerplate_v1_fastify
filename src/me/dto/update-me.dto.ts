import { Expose, plainToClass } from 'class-transformer';

export class UpdateMeDto {
  @Expose()
  password?: string;
  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
