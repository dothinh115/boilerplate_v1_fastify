import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
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

  getBcryptHash(string: string) {
    return bcrypt.hashSync(
      string,
      Number(this.configService.get('BCRYPT_LOOPS')),
    );
  }

  bcriptCompare(x: string, y: string) {
    return bcrypt.compareSync(x, y);
  }

  getToken(payload: any, expiresIn: string | number) {
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }
}
