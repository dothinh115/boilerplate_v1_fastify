import { Schema } from 'mongoose';
import settings from '../../../settings.json';
import settingPlugin from './setting.plugin';
import userPlugin from './user.plugin';
import textSearchPlugin from './text-search.plugin';
import { RoleSchema } from 'src/core/role/schema/role.schema';
import autoSlug from './auto-slug.plugin';
import { SettingSchema } from 'src/core/setting/schema/setting.schema';
import { UserSchema } from 'src/core/user/schema/user.schema';
import { FolderSchema } from 'src/core/upload/schema/folder.schema';
import referenceCheckPlugin from './reference-check.plugin';

export default function globalPlugin<T>(schema: Schema) {
  //text search plugin
  schema.plugin(textSearchPlugin);

  //setting plugin
  if (schema === SettingSchema) SettingSchema.plugin(settingPlugin);

  //role plugin
  if (schema === RoleSchema) RoleSchema.plugin(autoSlug);

  //user plugin
  if (schema === UserSchema) UserSchema.plugin(userPlugin);

  //folder
  if (schema === FolderSchema) FolderSchema.plugin(autoSlug);

  //ref check
  schema.plugin(referenceCheckPlugin);

  //timestamp
  if (settings.TIMESTAMP) schema.set('timestamps', true);

  //versionKey
  if (!settings.VERSION_KEY) schema.set('versionKey', false);
}
