import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import roles from 'utils/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesArr = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!rolesArr) return true;
    const req = context.switchToHttp().getRequest();
    const { _id } = req.user;
    const { id } = req.params;
    //trường hợp chính chủ (self)
    console.log(rolesArr);
    for (const role of rolesArr) {
      if (role === roles.self) return true;
    }

    //trường hợp là đúng phân quyền
    const userInfo = await this.userModel.findById(_id);
    for (const role of rolesArr) {
      if (role === userInfo.role) return true;
    }
  }
}
