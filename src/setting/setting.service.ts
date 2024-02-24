import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { TQuery } from 'src/utils/model/query.model';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './schema/setting.schema';
import { Model } from 'mongoose';
import { QueryService } from 'src/query/query.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingService: Model<Setting>,
    private queryService: QueryService,
    private responseService: ResponseService,
  ) {}
  async find(query: TQuery) {
    const result = await this.queryService.handleQuery(
      this.settingService,
      query,
    );
    return this.responseService.successResponse(result);
  }

  async update(body: UpdateSettingDto, query: TQuery) {
    await this.settingService.findOneAndUpdate(body);
    const result = await this.queryService.handleQuery(
      this.settingService,
      query,
    );
    return this.responseService.successResponse(result);
  }
}
