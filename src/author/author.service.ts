import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schema/author.schema';
import { toSlug } from 'utils/function';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async create(payload: CreateAuthorDto) {
    const { name } = payload;
    if (!name) return;

    const lastRecord = await this.authorModel.find().sort({ _id: -1 }).limit(1);

    const _id = lastRecord.length === 0 ? 1 : lastRecord[0]._id + 1;
    const data: any = {
      _id,
      name,
      slug: toSlug(name),
      category: payload.category,
    };
    const result = await this.authorModel.create(data);
    return result;
  }

  findAll() {
    return `This action returns all author`;
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
