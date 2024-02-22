import { Schema } from 'mongoose';
import { toSlug } from 'src/utils/function/function';

export default function rolePlugin<T>(schema: Schema) {
  schema.pre('save', async function () {
    if (this.title) {
      this.slug = toSlug(this.title as string);
    }
  });
}
