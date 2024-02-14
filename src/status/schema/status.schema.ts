import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatusDocument = HydratedDocument<Status>;

@Schema()
export class Status {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  slug: string;
  @Prop()
  sort?: number;
}

export const StatusSchema = SchemaFactory.createForClass(Status)
  .set('versionKey', false)
  .set('timestamps', true);
