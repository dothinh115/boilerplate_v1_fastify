import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CatgorySchema } from './schema/category.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Story, StorySchema } from 'src/story/schema/story.schema';
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
      { name: Category.name, schema: CatgorySchema },
      { name: Story.name, schema: StorySchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    QueryModule,
    CommonModule,
    ResponseModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
