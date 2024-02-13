import { Global, Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schema/story.schema';
import { Author, AuthorSchema } from 'src/author/schema/author.schema';
import { Status, StatusSchema } from 'src/status/schema/status.schema';
import { Category, CatgorySchema } from 'src/category/schema/category.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Status.name, schema: StatusSchema },
      { name: Category.name, schema: CatgorySchema },
    ]),
  ],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
