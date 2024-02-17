import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { getId, toSlug } from 'utils/function';
import { TQuery } from 'utils/model/query.model';
import { failResponse, successResponse } from 'utils/response';
import { Story } from 'src/story/schema/story.schema';
import { handleQuery } from 'utils/query/handleQuery';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
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

  async find(query: TQuery) {
    return await handleQuery(this.categoryModel, query);
  }

  async update(id: number, body: UpdateCategoryDto, query: TQuery) {
    const existCheck = await this.categoryModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại thể loại này!');
    await this.categoryModel.findByIdAndUpdate(id, {
      ...body,
      slug: toSlug(body.title),
    });
    const result = await handleQuery(this.categoryModel, query, id);
    return result;
  }

  async remove(id: number) {
    const existCheck = await this.categoryModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại thể loại này!');
    const storyCheck = await this.storyModel.findOne({
      category: {
        $in: id,
      },
    });
    if (storyCheck)
      return failResponse(
        'Không thể xoá thể loại này vì có thể còn tồn tại ở truyện nào đó!',
      );
    await this.categoryModel.findByIdAndDelete(id);
    return successResponse({
      message: 'Thành công!',
    });
  }
}
