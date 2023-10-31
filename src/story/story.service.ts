import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { getLastKey, getLastValue, toUrlCode } from 'utils/function';
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
    filter: string;
    limit: number;
    page: number;
    meta: {
      total_count: boolean;
      filter_count: boolean;
    };
  }) {
    let { fields, filter } = query;
    console.log(filter);
    if (!fields) fields = '*';
    /*
      author_story_authorToauthor: {
        id: {
          _eq: 2
        }
      }
    */
    let lastValue: string | number | boolean, lastKey: string;
    if (filter) {
      lastValue = getLastValue(filter);
      lastKey = getLastKey(filter, lastValue);
    }
    let fieldsArr = fields.split(',').filter((item: string) => item !== '');
    let selectObj: any = {};
    if (fieldsArr && fieldsArr.length > 0) {
      for (const field of fieldsArr) {
        if (field === '*') continue;
        selectObj[field] = true;
      }
    }

    const select = Object.keys(selectObj).length > 0 ? {
      select: selectObj
    } : {
      include:true
    }

    const result = await this.prisma.story.findMany({
      include: {
        
      },
      ...(query.limit &&
        query.page && {
          skip: (Number(query.page) - 1) * Number(query.limit),
          take: Number(query.limit),
        }),
    });
    // for (const item of resultAllFields) {
    //   const resultObj = {};
    //   for (const field of fieldsArr) {
    //     resultObj[field] = item[field];
    //   }
    //   result = [...result, resultObj];
    // }

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
