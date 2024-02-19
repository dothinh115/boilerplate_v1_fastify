import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TQuery } from 'src/utils/model/query.model';
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
  async create(body: CreateUserDto, query: TQuery) {
    const { email, password } = body;
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

  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(this.userModel, query);
    return this.responseService.successResponse(result);
  }

  async update(id: string, body: UpdateUserDto, query: TQuery) {
    const { email, password } = body;

    const existCheck = await this.userModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại user này!');
    //tạm thời không cho đổi mail

    await this.userModel.findByIdAndUpdate(id, {
      ...body,
      ...(password && {
        password: bcrypt.hashSync(
          password,
          Number(this.configService.get('BCRYPT_LOOPS')),
        ),
      }),
    });
    const result = await this.queryService.handleQuery(
      this.userModel,
      query,
      id,
    );
    return this.responseService.successResponse(result);
  }

  async remove(id: string) {
    const existCheck = await this.userModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại user này!');
    await this.userModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
