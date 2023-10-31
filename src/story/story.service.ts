import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import {
  convertIdFromString,
  getLastKey,
  getLastValue,
  toUrlCode,
} from 'utils/function';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}
  async create(payload: CreateStoryDto) {
    const newStory = await this.prisma.story.create({
      data: {
        title: payload.title,
        description: payload.description,
        author: payload.author,
        slug: toUrlCode(payload.title),
      },
    });

    let category: any[] = [];

    for (const id of payload.category_id) {
      const newStoryCategory = await this.prisma.story_category.create({
        data: {
          story_id: newStory.id,
          category_id: id,
        },
        include: {
          category: true,
        },
      });
      category = [...category, newStoryCategory];
    }

    return {
      ...newStory,
      category,
    };
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
    let { fields, filter } = query;
    let lastValue: string | number | boolean, lastKey: string;
    if (filter) {
      lastValue = getLastValue(filter);
      lastKey = getLastKey(filter, lastValue);
    }
    let fieldsArr = fields
      ? fields.split(',').filter((item: string) => item !== '')
      : [];

    let selectObj: any = {};
    if (fieldsArr && fieldsArr.length > 0) {
      for (const field of fieldsArr) {
        selectObj[field] = true;
      }
    }

    if (filter) convertIdFromString(filter);

    const result = await this.prisma.story.findMany({
      ...(Object.keys(selectObj).length > 0 && {
        select: selectObj,
      }),
      ...(filter &&
        Object.keys(filter).length > 0 && {
          where: filter,
        }),
      ...(query.limit &&
        query.page && {
          skip: (Number(query.page) - 1) * Number(query.limit),
          take: Number(query.limit),
        }),
    });

    return {
      result,
    };
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
