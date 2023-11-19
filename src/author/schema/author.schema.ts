import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true, type: mongoose.Types.Array, ref: 'Category' })
  category: Category[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
