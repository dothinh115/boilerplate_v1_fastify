import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { handleFilter } from 'utils/handleFilter';
import { toSlug } from 'utils/function';
import { createFieldObj } from 'utils/handleFields';

@Injectable()
export class StoryService {
  constructor(@InjectModel(Story.name) private storyModel: Model<Story>) {}

  async create(payload: CreateStoryDto) {
    const { title, category_id, description } = payload;
    const lastRecord = await this.storyModel.find().sort({ _id: -1 }).limit(1);

    const _id = lastRecord.length === 0 ? 1 : (lastRecord[0]._id as number) + 1;
    const data = {
      _id,
      title,
      author: payload.author,
      category: category_id,
      description,
      slug: toSlug(title),
    };
    const result = await this.storyModel.create(data);
    return result;
  }

  async find(query: {
    fields: string;
    filter: object;
    limit: number;
    page: number;
    populate: string;
    meta: {
      total_count: boolean;
      filter_count: boolean;
    };
  }) {
    let result: any[] = [],
      pathArr: any[] = [],
      select: any,
      filter: any,
      total_count: number,
      filter_count: number;
    if (query.fields) {
      const { selectObj, fieldSplit } = createFieldObj(query.fields);
      select = selectObj;
      pathArr = fieldSplit;
    }

    if (query.filter) {
      filter = handleFilter(query.filter);
    }
    try {
      result = await this.storyModel
        .find({ ...filter }, { ...select })
        .populate(pathArr)
        .skip(+query.page - 1 * +query.limit)
        .limit(+query.limit)
        .lean();
      total_count = await this.storyModel.find().count();
      filter_count = await this.storyModel.find({ ...filter }).count();
    } catch (error) {}
    return { data: result, meta: { total_count, filter_count } };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} story`;
  // }

  // update(id: number, updateStoryDto: UpdateStoryDto) {
  //   return `This action updates a #${id} story`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} story`;
  // }

  /*

    await this.storyModel.find().populate([
      {
        path: 'author',
        populate: {
          path: 'category',
          select: 'title slug'
        }
      }
    ])
   */
}
