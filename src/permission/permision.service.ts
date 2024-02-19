import { Injectable } from '@nestjs/common';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { TQuery } from 'src/utils/model/query.model';
import { QueryService } from 'src/query/query.service';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schema/permission.schema';
import { Model } from 'mongoose';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class PermisionService {
  constructor(
    private queryService: QueryService,
    private responseService: ResponseService,
    @InjectModel(Permission.name) private permissionService: Model<Permission>,
  ) {}

  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(
      this.permissionService,
      query,
    );
    return this.responseService.successResponse(result);
  }

  async update(id: string, body: UpdatePermisionDto, query: TQuery) {
    const existCheck = await this.permissionService.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại route này!');
    await this.permissionService.findByIdAndUpdate(id, body);
    const result = await this.queryService.handleQuery(
      this.permissionService,
      query,
      id,
    );
    return result;
  }
}
