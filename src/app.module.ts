import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoryModule } from './story/story.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorModule } from './author/author.module';
import { ChapterModule } from './chapter/chapter.module';
import { CategoryModule } from './category/category.module';
import { StatusModule } from './status/status.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

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
    StatusModule,
    AuthModule,
    UserModule,
    RoleModule,
    RefreshTokenModule,
  ],
})
export class AppModule {}
