import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission {
  @Prop({ required: true })
  path: string;
  @Prop({ required: true })
  method: string;
  @Prop({ type: mongoose.Schema.Types.Array, ref: 'Role' })
  accessable: Role[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)
  .set('versionKey', false)
  .set('timestamps', true);
