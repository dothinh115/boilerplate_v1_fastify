import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/core/permission/schema/permission.schema';
import { User } from 'src/core/user/schema/user.schema';
import settings from '../../../settings.json';
import { Route } from 'src/core/route/schema/route.schema';
import { Setting } from 'src/core/setting/schema/setting.schema';

export class BoostrapService {
  constructor(
    private adapterHost: HttpAdapterHost,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) {}
  private getParentRoute = (route: string) => {
    return route
      .split('/api/')
      .filter((x: string) => x !== '')
      .toString()
      .split('/')[0];
  };
  //Tạo setting object
  async createSetting() {
    const exist = await this.settingModel.findOne();
    if (!exist) {
      await this.settingModel.create({});
      console.log('Tạo thành công setting');
    }
  }

  //Hàm check và lưu toàn bộ path trong dự án
  async handlePath() {
    const httpAdapter = this.adapterHost.httpAdapter;
    const server = await httpAdapter.getInstance();
    const routesMap = new Map(server.routes);
    let parentRoutes: any = new Set();
    const existingRoutes: { path: string; method: string }[] = [];
    for (const [path, routeArray] of routesMap) {
      for (const routeData of routeArray as Array<any>) {
        const route = {
          path: path as string,
          method: routeData.method.toLowerCase(),
        };
        existingRoutes.push(route);
      }
      parentRoutes.add(this.getParentRoute(path as string));
    }

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
        let permissionSet = new Set(findParentRoute.permission);
        permissionSet.add(permission._id.toString());
        const permissionArr = Array.from(permissionSet);
        await this.routeModel.findByIdAndUpdate(findParentRoute._id, {
          permission: permissionArr,
        });
      }
    }

    //Xoá các route đã cũ
    const savedRoutes = await this.permissionModel.find();
    //xoá lần 1, so với các route đang tồn tại
    for (const savedRoute of savedRoutes) {
      const find = existingRoutes.find((route) => {
        return (
          route.path === savedRoute.path && route.method === savedRoute.method
        );
      });
      for (const excludedRoute of settings.EXCLUDED_ROUTE) {
        if (this.getParentRoute(savedRoute.path) === excludedRoute || !find)
          await this.permissionModel.findByIdAndDelete(savedRoute._id);
      }
    }
  }

  //Hàm check root_user
  async rootUserCheck() {
    const setting = await this.settingModel.findOne();
    const rootUser = await this.userModel.findOne({ rootUser: true });
    if (setting.rootUser && rootUser) return;
    const created = await this.userModel.create({
      email: this.configService.get('ROOT_USER'),
      password: this.configService.get('ROOT_PASS'),
      actived: true,
      rootUser: true,
    });
    await this.settingModel.findOneAndUpdate({
      rootUser: created._id,
    });
    console.log(
      `Tạo thành công root user\nEmail: ${
        created.email
      }\nPassword: ${this.configService.get('ROOT_PASS')}`,
    );
  }
}

@Injectable()
export class OnBootStrapService implements OnApplicationBootstrap {
  constructor(private bootstrapService: BoostrapService) {}
  async onApplicationBootstrap() {
    await this.bootstrapService.createSetting();
    await this.bootstrapService.handlePath();
    console.log('Tạo thành công các permissions');
    await this.bootstrapService.rootUserCheck();
  }
}
