import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  defaultRolePlugin,
  passwordHashPlugin,
} from '../../utils/mongoose/middleware/user.middleware';
import DefaultUser from 'src/utils/mongoose/model/user.model';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends DefaultUser {}

export const UserSchema = SchemaFactory.createForClass(User);

const plugins = [defaultRolePlugin, passwordHashPlugin];
plugins.forEach((plugin) => {
  UserSchema.plugin(plugin);
});
