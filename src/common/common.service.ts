import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CommonService {
  toSlug(str: string) {
    str = str.toLowerCase();
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[đĐ]/g, 'd');
    str = str.replace(/([^0-9a-z-\s])/g, '');
    str = str.replace(/(\s+)/g, '-');
    str = str.replace(/-+/g, '-');
    str = str.replace(/^-+|-+$/g, '');
    return str;
  }

  async getId<T>(model: Model<T>) {
    const lastRecord = await model.find().sort({ _id: -1 }).limit(1);
    const _id = lastRecord.length === 0 ? 1 : +lastRecord[0]._id + 1;
    return _id;
  }
}
