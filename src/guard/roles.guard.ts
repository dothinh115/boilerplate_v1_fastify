import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permission/schema/permission.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { route, user } = context.switchToHttp().getRequest();
    if (!user) return true;
    const { role, rootUser } = user;
    if (rootUser) return true;
    const path = route.path;
    let method: string;
    for (const key in route.methods) {
      method = key;
      break;
    }
    const accessCheck = await this.permissionModel.findOne({
      path,
      method,
    });
    for (const access of accessCheck.roles) {
      if (access === role) return true;
    }
    return false;
  }
}
