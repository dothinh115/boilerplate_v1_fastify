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
import { TQuery } from 'utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import roles from 'utils/roles';

@UsePipes(new ValidationPipe())
@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Post()
  create(@Body() body: CreateChapterDto, @Query() query: TQuery) {
    body = CreateChapterDto.plainToClass(body);
    return this.chapterService.create(body, query);
  }

  @Get()
  find(@Query() query: TQuery) {
    return this.chapterService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateChapterDto,
    @Query() query: TQuery,
  ) {
    return this.chapterService.update(+id, body, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(+id);
  }
}
