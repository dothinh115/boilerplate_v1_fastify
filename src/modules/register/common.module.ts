import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AutoIncrement,
  AutoIncrementSchema,
} from 'src/middlewares/mongoose/auto-increment.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AutoIncrement.name,
        schema: AutoIncrementSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class RegisterModule {}
