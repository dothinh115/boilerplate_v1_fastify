import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StoryModule } from './story/story.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModule } from './author/author.module';
import { ChapterModule } from './chapter/chapter.module';
import { CategoryModule } from './category/category.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StoryModule,
    MongooseModule.forRoot('mongodb://root:1234@localhost:27017', {
      dbName: 'truyenhot',
    }),
    AuthorModule,
    ChapterModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
