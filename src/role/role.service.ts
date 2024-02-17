import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { toSlug } from 'utils/function';
import { TQuery } from 'utils/model/query.model';
import { failResponse, successResponse } from 'utils/response';
import { handleQuery } from 'utils/query/handleQuery';
import roles from 'utils/roles';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(payload: CreateRoleDto, query: TQuery) {
    const { title } = payload;
    const dupCheck = await this.roleModel.findOne({
      title,
    });
    if (dupCheck) return failResponse('Đã tồn tại role này');
    const data = {
      title,
      slug: toSlug(title),
    };
    const result = await this.roleModel.create(data);
    return await handleQuery(this.roleModel, query, result._id);
  }

  async find(query: TQuery) {
    return await handleQuery(this.roleModel, query);
  }

  async update(id: string, body: UpdateRoleDto, query: TQuery) {
    const existCheck = await this.roleModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại role này!');
    await this.roleModel.findByIdAndUpdate(id, body);
    return await handleQuery(this.roleModel, query, id);
  }

  async remove(id: string) {
    const existCheck = await this.roleModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại role này!');
    for (const index in roles) {
      if (id === roles[index]) return failResponse('Không thể xoá role này!');
    }
    await this.roleModel.findByIdAndDelete(id);
    return successResponse({
      message: 'Thành công!',
    });
  }
}
