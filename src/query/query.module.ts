import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}
