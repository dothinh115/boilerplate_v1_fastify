import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { QueryModule } from './query/query.module';
import { MeModule } from './me/me.module';
import { MailModule } from './mail/mail.module';
import { PermisionModule } from './permission/permision.module';
import { DiscoveryModule } from '@nestjs/core';
import { StrategyModule } from './strategy/strategy.module';
import { RouteModule } from './route/route.module';
import { SettingModule } from './setting/setting.module';
import globalPlugin from './utils/mongoose/middleware/global.middleware';
import { Connection } from 'mongoose';
import { BootstrapModule } from './bootstrap/bootstrap.module';

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
    AuthModule,
    UserModule,
    RoleModule,
    CommonModule,
    QueryModule,
    MeModule,
    MailModule,
    PermisionModule,
    DiscoveryModule,
    BootstrapModule,
    StrategyModule,
    RouteModule,
    SettingModule,
  ],
})
export class AppModule {}
