import { Global, Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schema/story.schema';
import { Author, AuthorSchema } from 'src/author/schema/author.schema';
import { Status, StatusSchema } from 'src/story/schema/status.schema';
import { Category, CatgorySchema } from 'src/category/schema/category.schema';
import { Chapter, ChapterSchema } from 'src/chapter/schema/chapter.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { QueryModule } from 'src/query/query.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Status.name, schema: StatusSchema },
      { name: Category.name, schema: CatgorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: User.name, schema: UserSchema },
    ]),
    QueryModule,
    CommonModule,
  ],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
