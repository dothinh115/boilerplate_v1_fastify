import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  slug: string;
  @Prop()
  sort?: number;
}

export const CatgorySchema = SchemaFactory.createForClass(Category)
  .set('versionKey', false)
  .set('timestamps', true);
