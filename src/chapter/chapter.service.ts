import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { TQuery } from 'utils/model/query.model';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './schema/chapter.schema';
import { Model } from 'mongoose';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    private queryService: QueryService,
  ) {}
  create(createChapterDto: CreateChapterDto) {
    return 'This action adds a new chapter';
  }

  async find(query: TQuery) {
    const result = this.queryService.handleQuery(this.chapterModel, query);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} chapter`;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapter`;
  }
}
