import { Module } from '@nestjs/common';
import { InitService, OnInitService } from './init.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';
import { ConfigModule } from '@nestjs/config';
import { Role, RoleSchema } from 'src/role/schema/role.schema';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
    ConfigModule,
    CommonModule,
  ],
  providers: [OnInitService, InitService],
  exports: [OnInitService],
})
export class InitModule {}
