import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Author } from 'src/author/schema/author.schema';
import { Category } from 'src/category/schema/category.schema';
export type StoryDocument = HydratedDocument<Story>;

@Schema()
export class Story {
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  _id: number | string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, ref: 'Author' })
  author: Author;
  @Prop({ required: true, type: mongoose.Schema.Types.Array, ref: 'Category' })
  category: Category[];
  @Prop({ required: true })
  description: string;
}

export const StorySchema = SchemaFactory.createForClass(Story).set(
  'versionKey',
  false,
);
