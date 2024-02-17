import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';
import roles from 'utils/roles';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, lowercase: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ default: false })
  actived: boolean;
  @Prop({
    required: true,
    default: roles.member,
    type: mongoose.Schema.Types.String,
    ref: 'Role',
  })
  role: Role | string;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set('versionKey', false)
  .set('timestamps', true);
