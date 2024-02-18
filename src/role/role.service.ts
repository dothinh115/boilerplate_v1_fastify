import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { TQuery } from 'utils/model/query.model';
import roles from 'utils/roles';
import { QueryService } from 'src/query/query.service';
import { CommonService } from 'src/common/common.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private queryService: QueryService,
    private commonService: CommonService,
    private responseService: ResponseService,
  ) {}
  async create(payload: CreateRoleDto, query: TQuery) {
    const { title } = payload;
    const dupCheck = await this.roleModel.findOne({
      title,
    });
    if (dupCheck)
      return this.responseService.failResponse('Đã tồn tại role này');
    const data = {
      title,
      slug: this.commonService.toSlug(title),
    };
    const result = await this.roleModel.create(data);
    return await this.queryService.handleQuery(
      this.roleModel,
      query,
      result._id,
    );
  }

  async find(query: TQuery) {
    return await this.queryService.handleQuery(this.roleModel, query);
  }

  async update(id: string, body: UpdateRoleDto, query: TQuery) {
    const existCheck = await this.roleModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại role này!');
    await this.roleModel.findByIdAndUpdate(id, body);
    return await this.queryService.handleQuery(this.roleModel, query, id);
  }

  async remove(id: string) {
    const existCheck = await this.roleModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại role này!');
    for (const index in roles) {
      if (id === roles[index])
        return this.responseService.failResponse('Không thể xoá role này!');
    }
    await this.roleModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
