import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { getId, toSlug } from 'utils/function';
import axios from 'axios';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(payload: CreateCategoryDto) {
    const { title } = payload;
    if (!title) return;

    const _id = await getId(this.categoryModel);
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

  async abc() {
    const fetchCategories = await axios(
      'http://localhost:5500/api/categories/getAll',
    );
    const categories = fetchCategories.data.result;
    for (const category of categories) {
      await this.create({
        title: category.cate_title,
      });
    }
  }
}
