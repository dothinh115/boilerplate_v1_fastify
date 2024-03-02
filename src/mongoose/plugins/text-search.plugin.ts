import { Schema } from 'mongoose';
import { toNonAccented } from 'src/utils/functions/function';
import settings from '../../settings.json';

export default function textSearchPlugin<T>(schema: Schema<T>) {
  //Thêm trường text search
  schema.pre('save', async function (next) {
    for (const field of settings.TEXT_SEARCH) {
      if (this.schema.obj[field] && this[field]) {
        this.$set({
          [`${field}NonAccented`]: toNonAccented(this[field] as string),
        });
      }
    }
    next();
  });

  //khi update lại trường dc đặt thì cũng phải thay đổi các trường text search
  schema.pre('findOneAndUpdate', async function (next) {
    const payload: any = this.getUpdate();
    for (const field of settings.TEXT_SEARCH) {
      if (payload[field]) {
        this.set({
          [`${field}NonAccented`]: toNonAccented(payload[field] as string),
        });
        this.select(`-${field}NonAccented`);
      }
    }
    next();
  });

  schema.pre(['find', 'findOne'], async function (next) {
    for (const field of settings.TEXT_SEARCH) {
      this.select(`-${field}NonAccented`);
    }
    next();
  });
}