import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { getId, toSlug } from 'utils/function';
import { handleQuery } from 'utils/handleFields';
import { TQuery } from 'model/query.model';
import axios from 'axios';
import { Author } from 'src/author/schema/author.schema';
import { Status } from 'src/status/schema/status.schema';
import { Category } from 'src/category/schema/category.schema';
import { Chapter } from 'src/chapter/schema/chapter.schema';
import { failResponse, successResponse } from 'utils/response';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Status.name) private statusModel: Model<Status>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}

  async create(payload: CreateStoryDto) {
    const { title, category, description, author, status, source, story_code } =
      payload;
    const dupCheck = await this.storyModel.findOne({
      title,
      author,
    });
    if (dupCheck) return failResponse('Truyện đã tồn tại!');
    const _id = await getId(this.storyModel);
    const data = {
      _id,
      title,
      author,
      category,
      description,
      status,
      slug: toSlug(title),
      source,
      story_code,
    };
    const result = await this.storyModel.create(data);
    return result;
  }

  async find(query: TQuery) {
    const result = handleQuery<Story>(this.storyModel, query);
    return result;
  }

  // update(id: number, updateStoryDto: UpdateStoryDto) {
  //   return `This action updates a #${id} story`;
  // }

  async remove(id: number) {
    const existCheck = await this.storyModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại truyện này!');
    await this.storyModel.findByIdAndDelete(id);
    return successResponse({
      message: 'Thành công!',
    });
  }

  // async abc() {
  //   const fetchTotalStories = await axios.get(
  //     'http://localhost:5500/api/stories/getNumber',
  //   );
  //   const totalStories = fetchTotalStories.data.number;
  //   const perPage = 50;
  //   const totalPages = Math.floor(totalStories / perPage) + 1;
  //   let percentage = 0;
  //   let done = 0;
  //   for (let page = 1; page <= totalPages; page++) {
  //     const getAll = await axios.get(
  //       `http://localhost:5500/api/stories/getAll?limit=${perPage}&page=${page}`,
  //     );
  //     const dataArr = getAll.data.result; //data của 50 truyện
  //     //loop 50 truyện
  //     for (const story of dataArr) {
  //       //tìm tác giả
  //       let author;
  //       const findAuthor = await this.authorModel.findOne({
  //         name: story.story_author,
  //       });
  //       if (!findAuthor) continue;
  //       author = findAuthor._id;
  //       //tìm status
  //       let status = 2;
  //       if (story.story_status === 'Full') status = 1;
  //       //tìm category
  //       let category: number[] = [];
  //       for (const cate of story.story_category) {
  //         const findCategory = await this.categoryModel.findOne({
  //           title: cate.cate_title,
  //         });
  //         category = [...category, findCategory._id];
  //       }
  //       //tiến hành tạo truyện
  //       let isSuccess = false;
  //       try {
  //         const newStory: any = await this.create({
  //           author,
  //           category,
  //           description: story.story_description,
  //           status,
  //           title: story.story_title,
  //           source: story.story_source,
  //           story_code: story.story_code,
  //         });

  //         done++;
  //         percentage = (done / totalStories) * 100;
  //         console.log(
  //           `Đã hoàn thành ${percentage.toFixed(2)}%, truyện: ${
  //             story.story_title
  //           }`,
  //         );
  //         isSuccess = true;
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       if (!isSuccess) continue;
  //     }
  //   }
  // }

  // async xyz() {
  //   const totalStories = await this.storyModel.find().countDocuments();
  //   const perPage = 50;
  //   let percentage = 0;
  //   let done = 0;
  //   let fixedPercentage: number = 0;
  //   const totalPagesOfStory = Math.floor(totalStories / perPage) + 1;
  //   for (let page = 1; page <= totalPagesOfStory; page++) {
  //     // copy chapter

  //     const stories = await this.storyModel
  //       .find()
  //       .skip((page - 1) * perPage)
  //       .limit(perPage);
  //     for (const story of stories) {
  //       // lấy tổng số chương
  //       const fetchTotalChapter = await axios.get(
  //         `http://localhost:5500/api/chapter/getChapterNumber/${story.story_code}`,
  //       );
  //       //kiểm tra tổng số chương
  //       const totalChapter = fetchTotalChapter.data;
  //       const totalChapterCheck = await this.chapterModel
  //         .find({
  //           story: story._id,
  //         })
  //         .countDocuments();
  //       if (totalChapter === totalChapterCheck) {
  //         done++;
  //         continue;
  //       }

  //       const chapterPerPage = 200;
  //       const chapterTotalPage = Math.floor(+totalChapter / chapterPerPage) + 1;
  //       for (let p = 1; p <= chapterTotalPage; p++) {
  //         const fetchChapterList = await axios.get(
  //           `http://localhost:5500/api/chapter/getChapter/${story.story_code}?limit=${chapterPerPage}&page=${p}`,
  //         );
  //         const chapterList = fetchChapterList.data; //list chapter của truyện
  //         //chạy vòng lặp ghi chapter vào csdl
  //         for (const chapter of chapterList) {
  //           // kiểm tra xem chap đã tồn tại hay chưa
  //           if (!chapter.chapter_name) continue;
  //           const dupCheck = await this.chapterModel.findOne({
  //             story: story._id,
  //             slug: toSlug(chapter.chapter_name),
  //           });
  //           if (dupCheck) continue;

  //           const _id = await getId(this.chapterModel);
  //           const storyId = story._id;
  //           const name = chapter.chapter_name || 'unknown';
  //           const slug = toSlug(name) || 'unknown';
  //           const title = chapter.chapter_title || null;
  //           const content = chapter.chapter_content || null;
  //           const data = {
  //             _id,
  //             story: storyId,
  //             name,
  //             slug,
  //             title,
  //             content,
  //           };
  //           await this.chapterModel.create(data);
  //         }
  //         done++;
  //         percentage = (done / totalStories) * 100;
  //         if (+percentage.toFixed(2) !== fixedPercentage) {
  //           console.log(
  //             `Đã hoàn thành ${percentage.toFixed(
  //               2,
  //             )}% (${done}/${totalStories})`,
  //           );
  //           fixedPercentage = +percentage.toFixed(2);
  //         }
  //       }
  //     }
  //   }
  // }
}
