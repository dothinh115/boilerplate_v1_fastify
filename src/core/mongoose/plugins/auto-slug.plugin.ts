import { Schema } from 'mongoose';
import { CommonService } from 'src/core/main/services/common.service';

export default function autoSlug<T>(
  schema: Schema<T>,
  options: { field: string } | undefined = { field: 'title' },
) {
  let { field } = options;
  const commonService = new CommonService();
  schema.pre('save', function (next) {
    if (this[field] && typeof this[field] === 'string') {
      this.$set({
        slug: commonService.toSlug(this[field] as string),
      });
    }
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    const payload = this.getUpdate();
    if (payload[field] && typeof payload[field] === 'string') {
      this.set({
        slug: commonService.toSlug(payload[field] as string),
      });
    }
    next();
  });
}
