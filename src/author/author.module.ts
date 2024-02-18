import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './schema/author.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { QueryModule } from 'src/query/query.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: User.name, schema: UserSchema },
    ]),
    QueryModule,
    CommonModule,
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
