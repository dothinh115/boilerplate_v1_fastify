import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './schema/author.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { QueryModule } from 'src/query/query.module';
import { CommonModule } from 'src/common/common.module';
import { ResponseModule } from 'src/response/response.module';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    QueryModule,
    CommonModule,
    ResponseModule,
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
