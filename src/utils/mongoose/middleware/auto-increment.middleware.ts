import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

export type AutoIncrementDocument = HydratedDocument<AutoIncrement>;

export class AutoIncrement {
  @Prop()
  field: string;
  @Prop()
  modelName: string;
  @Prop()
  count: number;
}

export const AutoIncrementSchema = SchemaFactory.createForClass(AutoIncrement);

export function autoIncrement(
  options: { field?: string; startAt?: number } | undefined,
) {
  let { field, startAt } = options;
  if (!field) field = '_id';
  if (!startAt) startAt = 1;
  async function letsIncrease(model: any) {
    const counterModel = model.model('AutoIncrement', AutoIncrementSchema);
    const modelName = model.constructor.modelName;
    const counter: any = await counterModel.findOne({
      modelName,
    });
    let result: number;
    if (!counter) {
      const counterData = {
        field,
        modelName,
        count: startAt,
      };
      await counterModel.create(counterData);
      result = startAt;
    } else {
      await counterModel.findByIdAndUpdate(counter._id, {
        count: counter.count + 1,
      });
      result = counter.count + 1;
    }
    return result;
  }
  return function <T>(schema: Schema) {
    schema.pre('save', async function (next) {
      const _id = await letsIncrease(this);
      console.log(_id);
      this.$set({
        [field]: _id,
      });
      next();
    });
  };
}
