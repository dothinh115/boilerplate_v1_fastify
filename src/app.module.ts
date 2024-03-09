import { Global, Module } from '@nestjs/common';
import { MainModule } from './core/main/main.module';

@Global()
@Module({
  imports: [MainModule],
})
export class AppModule {}
