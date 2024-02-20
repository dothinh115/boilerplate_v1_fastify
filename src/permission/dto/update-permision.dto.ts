import { Expose, plainToClass } from 'class-transformer';

export class UpdatePermisionDto {
  @Expose()
  role: any[];
  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
