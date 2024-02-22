import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permission/schema/permission.schema';
import { User } from 'src/user/schema/user.schema';
import { TRoute } from 'src/utils/model/route.model';
import { Role } from 'src/role/schema/role.schema';
import settings from '../settings.json';
import { Route } from 'src/route/schema/route.schema';
export class InitService {
  constructor(
    private adapterHost: HttpAdapterHost,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
  ) {}
  private getParentRoute = (route: string) => {
    return route
      .split('/api/')
      .filter((x: string) => x !== '')
      .toString()
      .split('/')[0];
  };
  //Hàm check và lưu toàn bộ path trong dự án
  async handlePath() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const server = httpAdapter.getHttpServer();
    const router = server._events.request._router;
    let parentRoutes: any = new Set();
    const existingRoutes: { path: string; method: string }[] = router.stack
      .map((routeObj: TRoute) => {
        if (routeObj.route) {
          const route = this.getParentRoute(routeObj.route.path);
          parentRoutes.add(route);
          return {
            path: routeObj.route.path,
            method: routeObj.route.stack[0].method,
          };
        }
      })
      .filter((item: any) => item !== undefined);
    parentRoutes = Array.from(parentRoutes);

    //Tạo route cha
    await this.routeModel.deleteMany();
    for (const parentRoute of parentRoutes) {
      const exist = await this.routeModel.exists({
        path: parentRoute,
      });
      if (exist) continue;
      let isContinue = true;
      for (const excluded of settings.EXCLUDED_ROUTE) {
        if (this.getParentRoute(parentRoute) === excluded) {
          isContinue = false;
          break;
        }
      }
      if (!isContinue) continue;
      await this.routeModel.create({
        path: parentRoute,
      });
    }

    //Tạo permission
    for (const route of existingRoutes) {
      const existCheck = await this.permissionModel.findOne({
        path: route.path,
        method: route.method,
      });
      if (existCheck) continue;
      let isContinue = true;
      for (const excluded of settings.EXCLUDED_ROUTE) {
        if (this.getParentRoute(route.path) === excluded) {
          isContinue = false;
          break;
        }
      }
      if (!isContinue) continue;
      await this.permissionModel.create(route);
    }

    //add permissions vào route
    const permissions = await this.permissionModel.find();
    for (const permission of permissions) {
      const findParentRoute = await this.routeModel.findOne({
        path: this.getParentRoute(permission.path),
      });
      if (findParentRoute) {
        let permissionSet = new Set(findParentRoute.permissions);
        permissionSet.add(permission._id.toString());
        const permissionArr = Array.from(permissionSet);
        await this.routeModel.findByIdAndUpdate(findParentRoute._id, {
          permissions: permissionArr,
        });
      }
    }

    //Xoá các route đã cũ
    const allRoutes = await this.permissionModel.find();
    for (const route of allRoutes) {
      const find = existingRoutes.find(
        (x: { path: string; method: string }) =>
          route.path === x.path && route.method === x.method,
      );
      if (!find) await this.permissionModel.findByIdAndDelete(route._id);
    }
  }

  //Hàm check role
  async roleCheck() {
    const roleCount = await this.roleModel.find().countDocuments();
    if (roleCount > 0) return;
    //Nếu chưa có role nào thì tạo 2 role mặc định
    const memberRole = {
      title: settings.ROLES.MEMBER,
    };
    const adminRole = {
      title: settings.ROLES.ADMIN,
    };
    //Tạo 2 role mặc định
    await this.roleModel.create(memberRole);
    console.log(`Tạo thành công role ${memberRole.title}`);
    await this.roleModel.create(adminRole);
    console.log(`Tạo thành công role ${adminRole.title}`);
  }

  //Hàm check root_user
  async rootUserCheck() {
    const userCount = await this.userModel.find().countDocuments();
    if (userCount > 0) return;
    const rootUser = {
      email: this.configService.get('ROOT_USER'),
      password: this.configService.get('ROOT_PASS'),
      actived: true,
      rootUser: true,
    };
    await this.userModel.create(rootUser);
    console.log(
      `Tạo thành công root user\nEmail: ${
        rootUser.email
      }\nPassword: ${this.configService.get('ROOT_PASS')}`,
    );
  }
}

@Injectable()
export class OnInitService implements OnModuleInit {
  constructor(private initService: InitService) {}
  async onModuleInit() {
    await this.initService.handlePath();
    await this.initService.roleCheck();
    await this.initService.rootUserCheck();
  }
}
