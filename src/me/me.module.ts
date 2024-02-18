import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { QueryModule } from 'src/query/query.module';
import { ResponseModule } from 'src/response/response.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    QueryModule,
    ResponseModule,
    UserModule,
  ],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
