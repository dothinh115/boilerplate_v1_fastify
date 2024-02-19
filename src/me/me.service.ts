import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { QueryService } from 'src/query/query.service';
import { ResponseService } from 'src/response/response.service';
import { TQuery } from 'src/utils/model/query.model';

@Injectable()
export class MeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private queryService: QueryService,
    private responseService: ResponseService,
  ) {}

  async find(_id: string, query: TQuery) {
    const result = await this.queryService.handleQuery(
      this.userModel,
      query,
      _id,
    );
    return this.responseService.successResponse(result);
  }
}
