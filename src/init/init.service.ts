import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permission/schema/permission.schema';
import { User } from 'src/user/schema/user.schema';
import { TRoute } from 'src/utils/model/route.model';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/role/schema/role.schema';
import { CommonService } from 'src/common/common.service';

export class InitService {
  constructor(
    private adapterHost: HttpAdapterHost,
    private configService: ConfigService,
    private commonService: CommonService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
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
    let parentRoute: any = new Set();
    const existingRoutes: { path: string; method: string }[] = router.stack
      .map((routeObj: TRoute) => {
        if (routeObj.route) {
          const route = this.getParentRoute(routeObj.route.path);
          parentRoute.add(route);
          return {
            path: routeObj.route.path,
            method: routeObj.route.stack[0].method,
          };
        }
      })
      .filter((item: any) => item !== undefined);
    parentRoute = Array.from(parentRoute).filter((x: string) => x !== 'auth');

    //Tạo route
    for (const route of existingRoutes) {
      const existCheck = await this.permissionModel.findOne({
        path: route.path,
        method: route.method,
      });
      if (
        existCheck ||
        this.getParentRoute(route.path) === 'auth' ||
        this.getParentRoute(route.path) === 'me'
      )
        continue;
      await this.permissionModel.create(route);
      console.log(`Tạo thành công permission cho route ${route.path}`);
    }

    //Xoá các route đã cũ
    const allRoutes = await this.permissionModel.find();
    for (const route of allRoutes) {
      const find = existingRoutes.find(
        (x: { path: string; method: string }) =>
          route.path === x.path && route.method === x.method,
      );
      if (
        !find ||
        this.getParentRoute(route.path) === 'auth' ||
        this.getParentRoute(route.path) === 'me'
      )
        await this.permissionModel.findByIdAndDelete(route._id);
    }
  }

  //Hàm check role
  async roleCheck() {
    const roleCount = await this.roleModel.find().countDocuments();
    if (roleCount > 0) return;
    //Nếu chưa có role nào thì tạo 2 role mặc định
    const memberRole = {
      title: 'Thành viên',
      slug: this.commonService.toSlug('Thành viên'),
    };
    const adminRole = {
      title: 'Quản trị viên',
      slug: this.commonService.toSlug('Quản trị viên'),
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
      password: bcrypt.hashSync(
        this.configService.get('ROOT_PASS'),
        Number(this.configService.get('BCRYPT_LOOPS')),
      ),
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
