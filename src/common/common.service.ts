import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(private jwtService: JwtService) {}
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

  bcriptCompare(x: string, y: string) {
    return bcrypt.compareSync(x, y);
  }

  getToken(payload: any, expiresIn: string | number) {
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }
}
