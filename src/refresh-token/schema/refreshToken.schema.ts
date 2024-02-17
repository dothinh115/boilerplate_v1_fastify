import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/schema/user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true, type: mongoose.Schema.Types.String, ref: 'User' })
  user: User;
  @Prop({ required: true })
  refresh_token: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
  .set('versionKey', false)
  .set('timestamps', true);
