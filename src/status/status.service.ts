import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './schema/status.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getId, toSlug } from 'utils/function';

@Injectable()
export class StatusService {
  constructor(@InjectModel(Status.name) private statusModel: Model<Status>) {}

  async create(createStatusDto: CreateStatusDto) {
    const { title } = createStatusDto;
    if (!title) return;
    //kiểm tra trùng lặp
    const dupCheck = await this.statusModel.findOne({
      title,
    });
    if (dupCheck) return;
    //tiến hành ghi vào csdl
    const _id = await getId(this.statusModel);
    const data: any = {
      _id,
      title,
      slug: toSlug(title),
    };
    const result = await this.statusModel.create(data);
    return result;
  }

  findAll() {
    return `This action returns all status`;
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
