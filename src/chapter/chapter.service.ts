import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { TQuery } from 'src/utils/model/query.model';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './schema/chapter.schema';
import { Model } from 'mongoose';
import { QueryService } from 'src/query/query.service';
import { ResponseService } from 'src/response/response.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    private queryService: QueryService,
    private responseService: ResponseService,
    private commonService: CommonService,
  ) {}
  async create(body: CreateChapterDto, query: TQuery) {
    const { story, name } = body;
    const existCheck = await this.chapterModel.findOne({
      story,
      name,
    });
    if (existCheck)
      return this.responseService.failResponse('Đã tồn tại chương này!');
    const _id = await this.commonService.getId(this.chapterModel);
    const data = {
      _id,
      ...body,
      slug: this.commonService.toSlug(body.name),
    };
    await this.chapterModel.create(data);
    const result = await this.queryService.handleQuery(
      this.chapterModel,
      query,
      _id,
    );
    return this.responseService.successResponse(result);
  }

  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(
      this.chapterModel,
      query,
    );
    return this.responseService.successResponse(result);
  }

  async update(id: number, body: UpdateChapterDto, query: TQuery) {
    const existCheck = await this.chapterModel.findById(id);
    if (!existCheck)
      this.responseService.failResponse('Chương này không tồn tại!');
    await this.chapterModel.findByIdAndUpdate(id, body);
    const result = await this.queryService.handleQuery(
      this.chapterModel,
      query,
      id,
    );
    return this.responseService.successResponse(result);
  }

  async remove(id: number) {
    const existCheck = await this.chapterModel.findById(id);
    if (!existCheck)
      this.responseService.failResponse('Chương này không tồn tại!');
    await this.chapterModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
