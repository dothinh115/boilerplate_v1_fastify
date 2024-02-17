import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertService {
  //CONVERT TÁC GIẢ
  // async authorConvert() {
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
  //     const dataArr = getAll.data.result;
  //     for (const story of dataArr) {
  //       const author: string = story.story_author;
  //       done++;
  //       percentage = Math.round(done / totalStories) * 100;
  //       console.log(
  //         `Đã hoàn thành ${percentage}% (${done}/${totalStories}). Tác giả: ${author}, slug: ${toSlug(
  //           author,
  //         )}`,
  //       );
  //       await this.create({
  //         name: author,
  //       });
  //     }
  //   }
  // }
  // CONVERT CATE
  // async categoryConvert() {
  //   const fetchCategories = await axios(
  //     'http://localhost:5500/api/categories/getAll',
  //   );
  //   const categories = fetchCategories.data.result;
  //   for (const category of categories) {
  //     await this.create({
  //       title: category.cate_title,
  //     });
  //   }
  // }
  //CONVERT TRUYỆN
  // async storyConvert() {
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
  // async chapterConvert() {
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
