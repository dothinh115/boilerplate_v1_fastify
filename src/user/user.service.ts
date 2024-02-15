import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { failResponse } from 'utils/function';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TQuery } from 'model/query.model';
import { handleQuery } from 'utils/handleFields';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}
  async create(payload: CreateUserDto, query: TQuery) {
    const { email, password } = payload;
    const dupCheck = await this.userModel.findOne({
      email,
    });
    if (dupCheck) return failResponse(400, 'Email đã được dùng!');
    const data = {
      email,
      password: bcrypt.hashSync(
        password,
        Number(this.configService.get('BCRYPT_LOOPS')),
      ),
    };
    const result = await this.userModel.create(data);
    return await handleQuery(this.userModel, query, result._id);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
