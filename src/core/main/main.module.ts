import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { BcryptService } from './bcrypt.service';
import { BoostrapService, OnBootStrapService } from './bootstrap.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.service';
import { QueryService } from './query.service';
import { StrategyService } from './strategy.service';
import { AssetsController } from './assets.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import globalPlugin from '../mongoose/plugins/global.plugin';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { MeModule } from '../me/me.module';
import { MailModule } from '../mail/mail.module';
import { PermisionModule } from '../permission/permision.module';
import { RouteModule } from '../route/route.module';
import { SettingModule } from '../setting/setting.module';
import { UploadModule } from '../upload/upload.module';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
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
    MeModule,
    MailModule,
    PermisionModule,
    RouteModule,
    SettingModule,
    UploadModule,
  ],
  controllers: [AssetsController],
  providers: [
    CommonService,
    BcryptService,
    OnBootStrapService,
    BoostrapService,
    QueryService,
    StrategyService,
    RolesGuard,
  ],
  exports: [
    CommonService,
    BcryptService,
    OnBootStrapService,
    MulterModule,
    QueryService,
    StrategyService,
    ConfigModule,
    MongooseModule,
    AuthModule,
    UserModule,
    RoleModule,
    MeModule,
    MailModule,
    PermisionModule,
    RouteModule,
    SettingModule,
    UploadModule,
    RolesGuard,
  ],
})
export class MainModule {}
