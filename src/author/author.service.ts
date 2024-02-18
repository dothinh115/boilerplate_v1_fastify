import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schema/author.schema';
import { TQuery } from 'utils/model/query.model';
import { QueryService } from 'src/query/query.service';
import { CommonService } from 'src/common/common.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<Author>,
    private queryService: QueryService,
    private commonService: CommonService,
    private responseService: ResponseService,
  ) {}

  async create(payload: CreateAuthorDto) {
    const { name } = payload;
    if (!name) return;
    //kiểm tra trùng lặp
    const dupCheck = await this.authorModel.findOne({
      name,
    });
    if (dupCheck) return;

    //tiến hành ghi vào csdl
    const _id = await this.commonService.getId(this.authorModel);
    const data: any = {
      _id,
      name,
      slug: this.commonService.toSlug(name) || name,
    };
    const result = await this.authorModel.create(data);
    return result;
  }

  async find(query: TQuery) {
    return await this.queryService.handleQuery(this.authorModel, query);
  }

  async update(id: number, body: UpdateAuthorDto, query: TQuery) {
    const { name } = body;
    const existCheck = await this.authorModel.findById(id);
    if (!existCheck)
      return this.responseService.failResponse('Không tồn tại tác giả này');
    await this.authorModel.findByIdAndUpdate(id, {
      name,
      slug: this.commonService.toSlug(name) || name,
    });
    const result = await this.queryService.handleQuery(
      this.authorModel,
      query,
      id,
    );
    return result;
  }

  async remove(id: number) {
    const find = await this.authorModel.findById(id);
    if (!find)
      return this.responseService.failResponse('Không tìm thấy user này!');
    await this.authorModel.findByIdAndDelete(id);
    return this.responseService.successResponse('Thành công!');
  }
}
