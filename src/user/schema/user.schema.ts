import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

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
    type: mongoose.Schema.Types.String,
    ref: 'Role',
  })
  role: Role | any;
  @Prop({ default: false, immutable: true })
  rootUser: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set('versionKey', false)
  .set('timestamps', true);

UserSchema.pre('save', async function (next) {
  if (!this.role) {
    let role: any;
    const Role = this.model('Role') as Model<Role>;
    if (this.rootUser)
      role = await Role.findOne({
        title: 'Quản trị viên',
      });
    else
      role = await Role.findOne({
        title: 'Thành viên',
      });
    this.role = role._id;
  }
  next();
});
