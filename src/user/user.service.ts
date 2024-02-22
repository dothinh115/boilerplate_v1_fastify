import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { TQuery } from 'src/utils/model/query.model';
import { QueryService } from 'src/query/query.service';
import { ResponseService } from 'src/response/response.service';
import { CustomRequest } from 'src/utils/model/request.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private queryService: QueryService,
    private responseService: ResponseService,
  ) {}
  async create(body: CreateUserDto, query: TQuery) {
    const dupCheck = await this.userModel.findOne({
      email: body.email,
    });
    if (dupCheck)
      return this.responseService.failResponse('Email đã được dùng!');
    const create = await this.userModel.create(body);
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

  async update(
    id: string,
    body: UpdateUserDto,
    query: TQuery,
    req: CustomRequest,
  ) {
    const existCheck = await this.userModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại user này!');
    const { _id } = req.user._id;

    await this.userModel.findByIdAndUpdate(id, body, { _id });
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
