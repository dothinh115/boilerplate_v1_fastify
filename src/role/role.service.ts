import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { toSlug } from 'utils/function';
import { handleQuery } from 'utils/handleFields';
import { TQuery } from 'model/query.model';
import { failResponse } from 'utils/response';

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

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
