import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ default: false })
  actived: boolean;
  @Prop({
    required: true,
    default: '65ce5210c804ac46883c8729',
    type: mongoose.Schema.Types.String,
    ref: 'Role',
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set('versionKey', false)
  .set('timestamps', true);
