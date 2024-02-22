import { Schema } from 'mongoose';

export default function globalPlugin<T>(schema: Schema) {
  schema.set('versionKey', false).set('timestamps', true);
}
