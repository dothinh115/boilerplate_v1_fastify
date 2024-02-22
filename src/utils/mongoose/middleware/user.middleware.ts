import { Error, Model, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import settings from '../../../settings.json';
export const defaultRolePlugin = <T>(schema: Schema) => {
  schema.pre('save', async function () {
    if (!this.role) {
      let role: any;
      const Model = this.model('Role') as Model<T>;
      if (this.rootUser)
        role = await Model.findOne({
          title: settings.ROLES.ADMIN,
        });
      else
        role = await Model.findOne({
          title: settings.ROLES.MEMBER,
        });
      this.role = role._id.toString();
    }
  });
};

export const passwordHashPlugin = <T>(schema: Schema) => {
  schema.pre('save', async function () {
    if (this.password) {
      this.password = bcrypt.hashSync(
        this.password as string,
        Number(process.env.BCRYPT_LOOPS),
      );
    }
  });

  schema.pre('findOneAndUpdate', async function () {
    const payload: any = this.getUpdate();
    const options: any = this.getOptions();
    const query: any = this.getQuery();
    //check root user
    const user = await this.model.findOne(query).select('+rootUser');
    if (user.rootUser && user._id.toString() !== options._id.toString()) {
      throw new Error('Không thể update root user');
    }
    if (payload.password !== undefined)
      payload.password = bcrypt.hashSync(
        payload.password as string,
        Number(process.env.BCRYPT_LOOPS),
      );
  });
};
