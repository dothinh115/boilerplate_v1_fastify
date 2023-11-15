import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { toSlug } from 'utils/function';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(payload: CreateCategoryDto) {
    const { title } = payload;
    if (!title) return;
    const lastRecord = await this.categoryModel
      .find()
      .sort({ _id: -1 })
      .limit(1);

    const _id = lastRecord.length === 0 ? 1 : (lastRecord[0]._id as number) + 1;
    const data: Category = {
      _id,
      title,
      slug: toSlug(title),
    };
    const result = await this.categoryModel.create(data);
    return result;
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
