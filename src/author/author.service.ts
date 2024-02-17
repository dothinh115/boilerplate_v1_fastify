import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schema/author.schema';
import { getId, toSlug } from 'utils/function';
import axios from 'axios';
import { failResponse, successResponse } from 'utils/response';
import { TQuery } from 'model/query.model';
import { handleQuery } from 'utils/handleFields';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async create(payload: CreateAuthorDto) {
    const { name } = payload;
    if (!name) return;
    //kiểm tra trùng lặp
    const dupCheck = await this.authorModel.findOne({
      name,
    });
    if (dupCheck) return;

    //tiến hành ghi vào csdl
    const _id = await getId(this.authorModel);
    const data: any = {
      _id,
      name,
      slug: toSlug(name) || name,
    };
    const result = await this.authorModel.create(data);
    return result;
  }

  async find(query: TQuery) {
    return await handleQuery(this.authorModel, query);
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  async remove(id: number) {
    const find = await this.authorModel.findById(id);
    if (!find) return failResponse('Không tìm thấy user này!');
    await this.authorModel.findByIdAndDelete(id);
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
}
