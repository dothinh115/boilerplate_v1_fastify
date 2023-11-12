import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { toSlug } from 'utils/function';
import { Author } from 'src/author/schema/author.schema';
import { Category } from 'src/category/schema/category.schema';
@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(payload: CreateStoryDto) {
    const { title, category_id, description } = payload;
    const lastRecord = await this.storyModel.find().sort({ _id: -1 }).limit(1);

    const _id = lastRecord.length === 0 ? 1 : lastRecord[0]._id + 1;
    const data = {
      _id,
      title,
      author: payload.author,
      category: category_id,
      description,
      slug: toSlug(title),
    };
    const result = await this.storyModel.create(data);
    result.author = await this.authorModel.findById(payload.author);
    result.category = await this.categoryModel.find({
      _id: {
        $in: category_id,
      },
    });
    return result;
  }

  async find(query: {
    fields: string;
    filter: object;
    limit: number;
    page: number;
    meta: {
      total_count: boolean;
      filter_count: boolean;
    };
  }) {
    const { fields } = query;
    const nestedArr = fields
      .split(',')
      .filter((item) => item !== '')
      .filter((item) => item !== '*');
    let selectedProps: any;
    for (const select of nestedArr) {
      selectedProps = {
        ...selectedProps,
        [select]: true,
      };
    }

    let result: any;
    result = await this.storyModel.find().lean();

    for (const index in result) {
      if (nestedArr.length > 0) {
        for (const item of nestedArr) {
          try {
            result[index] = {
              ...result[index],
              [item]: await this[`${item}Model`].find({
                _id: {
                  $in: result[index][item],
                },
              }),
            };
          } catch (error) {}
        }
      }
    }

    let newResult: any;
    for (const item of query.fields.split(',')) {
      if (item === '*') {
        newResult = result;
        break;
      } else {
        newResult[item] = result[item];
      }
    }

    return newResult;
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
}
