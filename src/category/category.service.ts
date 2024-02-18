import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { TQuery } from 'utils/model/query.model';
import { Story } from 'src/story/schema/story.schema';
import { QueryService } from 'src/query/query.service';
import { CommonService } from 'src/common/common.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    private queryService: QueryService,
    private commonService: CommonService,
    private responseService: ResponseService,
  ) {}

  async create(body: CreateCategoryDto, query: TQuery) {
    const { title } = body;
    if (!title) return;

    const _id = await this.commonService.getId(this.categoryModel);
    const data: Category = {
      _id,
      title,
      slug: this.commonService.toSlug(title),
    };
    await this.categoryModel.create(data);
    const result = await this.queryService.handleQuery(
      this.categoryModel,
      query,
      _id,
    );
    return this.responseService.successResponse(result);
  }

  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(
      this.categoryModel,
      query,
    );
    return this.responseService.successResponse(result);
  }

  async update(id: number, body: UpdateCategoryDto, query: TQuery) {
    const existCheck = await this.categoryModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại thể loại này!');
    await this.categoryModel.findByIdAndUpdate(id, {
      ...body,
      slug: this.commonService.toSlug(body.title),
    });
    const result = await this.queryService.handleQuery(
      this.categoryModel,
      query,
      id,
    );
    return this.responseService.successResponse(result);
  }

  async remove(id: number) {
    const existCheck = await this.categoryModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại thể loại này!');
    const storyCheck = await this.storyModel.findOne({
      category: {
        $in: id,
      },
    });
    if (storyCheck)
      return this.responseService.failResponse(
        'Không thể xoá thể loại này vì có thể còn tồn tại ở truyện nào đó!',
      );
    await this.categoryModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
