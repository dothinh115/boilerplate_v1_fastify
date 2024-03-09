import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { QueryModule } from './query/query.module';
import { MeModule } from './me/me.module';
import { MailModule } from './mail/mail.module';
import { PermisionModule } from './permission/permision.module';
import { DiscoveryModule } from '@nestjs/core';
import { StrategyModule } from './strategy/strategy.module';
import { RouteModule } from './route/route.module';
import { SettingModule } from './setting/setting.module';
import globalPlugin from './mongoose/plugins/global.plugin';
import { Connection } from 'mongoose';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { UploadModule } from './upload/upload.module';
import { CustomMulterModule } from './multer/multer.module';
import { CommonModule } from './common/common.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      connectionFactory: async (connection: Connection) => {
        connection.plugin(globalPlugin);
        return connection;
      },
    }),
    CustomMulterModule,
    AuthModule,
    UserModule,
    RoleModule,
    QueryModule,
    MeModule,
    BcryptModule,
    MailModule,
    PermisionModule,
    DiscoveryModule,
    BootstrapModule,
    StrategyModule,
    RouteModule,
    SettingModule,
    UploadModule,
    CommonModule,
  ],
})
export class AppModule {}
