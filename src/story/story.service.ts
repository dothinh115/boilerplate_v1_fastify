import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story } from './schema/story.schema';
import { TQuery } from 'utils/model/query.model';
import { failResponse, successResponse } from 'utils/response';
import { UpdateStoryDto } from './dto/update-story.dto';
import { QueryService } from 'src/query/query.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
    private queryService: QueryService,
    private commonService: CommonService,
  ) {}

  async create(body: CreateStoryDto) {
    const { title, author } = body;
    const dupCheck = await this.storyModel.findOne({
      title,
      author,
    });
    if (dupCheck) return failResponse('Truyện đã tồn tại!');
    const _id = await this.commonService.getId(this.storyModel);
    const data = {
      _id,
      ...body,
      slug: this.commonService.toSlug(title),
    };
    const result = await this.storyModel.create(data);
    return result;
  }

  async find(query: TQuery) {
    const result = this.queryService.handleQuery(this.storyModel, query);
    return result;
  }

  async update(id: number, body: UpdateStoryDto, query: TQuery) {
    const existCheck = await this.storyModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại truyện này!');
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
    return result;
  }

  async remove(id: number) {
    const existCheck = await this.storyModel.findById(id);
    if (!existCheck) return failResponse('Không tồn tại truyện này!');
    await this.storyModel.findByIdAndDelete(id);
    return successResponse({
      message: 'Thành công!',
    });
  }
}
