import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({ required: true })
  _id: number;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
