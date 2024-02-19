import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { QueryModule } from 'src/query/query.module';
import { CommonModule } from 'src/common/common.module';
import { ResponseModule } from 'src/response/response.module';
import {
  Permission,
  PermissionSchema,
} from 'src/permision/schema/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
    QueryModule,
    CommonModule,
    ResponseModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
