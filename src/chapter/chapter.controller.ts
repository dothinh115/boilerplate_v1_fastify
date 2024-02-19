import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { TQuery } from 'src/utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';

@UsePipes(new ValidationPipe())
@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Post()
  create(@Body() body: CreateChapterDto, @Query() query: TQuery) {
    body = CreateChapterDto.plainToClass(body);
    return this.chapterService.create(body, query);
  }

  @UseGuards(RolesGuard)
  @Get()
  find(@Query() query: TQuery) {
    return this.chapterService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateChapterDto,
    @Query() query: TQuery,
  ) {
    body = UpdateChapterDto.plainToClass(body);
    return this.chapterService.update(+id, body, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(+id);
  }
}
