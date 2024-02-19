import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './schema/chapter.schema';
import { QueryModule } from 'src/query/query.module';
import { CommonModule } from 'src/common/common.module';
import { ResponseModule } from 'src/response/response.module';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chapter.name,
        schema: ChapterSchema,
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
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
