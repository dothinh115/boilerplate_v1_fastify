import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema()
export class Chapter {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, ref: 'Story' })
  story: number;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ default: null })
  title?: string;
  @Prop({ default: null })
  content: string;
  @Prop()
  sort?: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter)
  .set('versionKey', false)
  .set('timestamps', true);
