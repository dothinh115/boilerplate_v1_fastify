import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TQuery } from 'utils/model/query.model';
import { QueryService } from 'src/query/query.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private queryService: QueryService,
    private responseService: ResponseService,
  ) {}
  async create(payload: CreateUserDto, query: TQuery) {
    const { email, password } = payload;
    const dupCheck = await this.userModel.findOne({
      email,
    });
    if (dupCheck)
      return this.responseService.failResponse('Email đã được dùng!');
    const data = {
      email,
      password: bcrypt.hashSync(
        password,
        Number(this.configService.get('BCRYPT_LOOPS')),
      ),
    };
    const create = await this.userModel.create(data);
    const result = await this.queryService.handleQuery(
      this.userModel,
      query,
      create._id,
    );
    return this.responseService.successResponse(result);
  }

  find() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
