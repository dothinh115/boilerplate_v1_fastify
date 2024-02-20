import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { QueryModule } from './query/query.module';
import { ResponseModule } from './response/response.module';
import { MeModule } from './me/me.module';
import { MailModule } from './mail/mail.module';
import { PermisionModule } from './permission/permision.module';
import { DiscoveryModule } from '@nestjs/core';
import { InitModule } from './init/init.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    CommonModule,
    QueryModule,
    ResponseModule,
    MeModule,
    MailModule,
    PermisionModule,
    DiscoveryModule,
    InitModule,
  ],
})
export class AppModule {}
