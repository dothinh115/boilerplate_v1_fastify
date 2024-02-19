import { Module } from '@nestjs/common';
import { PermisionService } from './permision.service';
import { PermisionController } from './permision.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Permission, PermissionSchema } from './schema/permission.schema';
import { QueryModule } from 'src/query/query.module';
import { ResponseModule } from 'src/response/response.module';

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
    ]),
    QueryModule,
    ResponseModule,
  ],
  controllers: [PermisionController],
  providers: [PermisionService],
})
export class PermisionModule {}
