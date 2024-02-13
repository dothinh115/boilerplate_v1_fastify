import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { failResponse, getId, toSlug } from 'utils/function';
import { handleQuery } from 'utils/handleFields';
import { TQuery } from 'model/query.model';
import axios from 'axios';
import { Author } from 'src/author/schema/author.schema';
import { Status } from 'src/status/schema/status.schema';
import { Category } from 'src/category/schema/category.schema';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Status.name) private statusModel: Model<Status>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(payload: CreateStoryDto) {
    const { title, category, description, author, status } = payload;
    const dupCheck = await this.storyModel.findOne({
      title,
      author,
    });
    if (dupCheck) return failResponse(400, 'Truyện đã tồn tại!');
    const _id = await getId(this.storyModel);
    const data = {
      _id,
      title,
      author,
      category,
      description,
      status,
      slug: toSlug(title),
    };
    const result = await this.storyModel.create(data);
    return result;
  }

  async find(query: TQuery) {
    const result = handleQuery<Story>(this.storyModel, query);

    return result;
  }

  async abc() {
    const fetchTotalStories = await axios.get(
      'http://localhost:5500/api/stories/getNumber',
    );
    const totalStories = fetchTotalStories.data.number;
    const perPage = 50;
    const totalPages = Math.floor(totalStories / perPage) + 1;
    let percentage = 0;
    let done = 0;
    for (let page = 1; page <= totalPages; page++) {
      const getAll = await axios.get(
        `http://localhost:5500/api/stories/getAll?limit=${perPage}&page=${page}`,
      );
      const dataArr = getAll.data.result; //data của 50 truyện
      //loop 50 truyện
      for (const story of dataArr) {
        //tìm tác giả
        let author;
        const findAuthor = await this.authorModel.findOne({
          name: story.story_author,
        });
        if (!findAuthor) continue;
        author = findAuthor._id;
        //tìm status
        let status = 2;
        if (story.story_status === 'Full') status = 1;
        //tìm category
        let category: number[] = [];
        for (const cate of story.story_category) {
          const findCategory = await this.categoryModel.findOne({
            title: cate.cate_title,
          });
          category = [...category, findCategory._id];
        }
        await this.create({
          author,
          category,
          description: story.story_description,
          status,
          title: story.story_title,
        });
        done++;
        percentage = Math.round(done / totalStories) * 100;
        console.log(
          `Đã hoàn thành ${percentage}%, truyện: ${story.story_title}`,
        );
      }
    }
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
