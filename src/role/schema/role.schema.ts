import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  slug: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role)
  .set('versionKey', false)
  .set('timestamps', true);
