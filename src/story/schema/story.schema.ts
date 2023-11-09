import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type StoryDocument = HydratedDocument<Story>;
import * as mongoose from 'mongoose';
import { Author } from 'src/author/schema/author.schema';
import { Category } from 'src/category/schema/category.schema';
@Schema()
export class Story {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, ref: 'Author' })
  author: Author;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, ref: 'Category' })
  category: Category[];
  @Prop({ required: true })
  description: string;
  @Prop()
  chapter: number[];
}

export const StorySchema = SchemaFactory.createForClass(Story);
