import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { TQuery } from 'src/utils/model/query.model';
import { UpdateStoryDto } from './dto/update-story.dto';
import { QueryService } from 'src/query/query.service';
import { CommonService } from 'src/common/common.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
    private queryService: QueryService,
    private commonService: CommonService,
    private responseService: ResponseService,
  ) {}

  async create(body: CreateStoryDto, query: TQuery) {
    const { title, author } = body;
    const dupCheck = await this.storyModel.findOne({
      title,
      author,
    });
    if (dupCheck)
      return this.responseService.failResponse('Truyện đã tồn tại!');
    const _id = await this.commonService.getId(this.storyModel);
    const data = {
      _id,
      ...body,
      slug: this.commonService.toSlug(title),
    };
    await this.storyModel.create(data);
    const result = await this.queryService.handleQuery(
      this.storyModel,
      query,
      _id,
    );
    return this.responseService.successResponse(result);
  }

  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(this.storyModel, query);
    return this.responseService.successResponse(result);
  }

  async update(id: number, body: UpdateStoryDto, query: TQuery) {
    const existCheck = await this.storyModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại truyện này!');
    await this.storyModel.findByIdAndUpdate(id, {
      ...body,
      ...(body.title && {
        slug: this.commonService.toSlug(body.title),
      }),
    });
    const result = await this.queryService.handleQuery(
      this.storyModel,
      query,
      id,
    );
    return this.responseService.successResponse(result);
  }

  async remove(id: number) {
    const existCheck = await this.storyModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại truyện này!');
    await this.storyModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
