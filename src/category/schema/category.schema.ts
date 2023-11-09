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
}

export const CatgorySchema = SchemaFactory.createForClass(Category);
