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
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { TQuery } from 'utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import roles from 'utils/roles';

@Controller('story')
@UsePipes(new ValidationPipe())
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Post()
  create(@Body() body: CreateStoryDto, @Query() query: TQuery) {
    body = CreateStoryDto.plainToClass(body);
    return this.storyService.create(body, query);
  }

  @Get()
  find(@Query() query: TQuery) {
    return this.storyService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateStoryDto,
    @Query() query: TQuery,
  ) {
    return this.storyService.update(+id, body, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyService.remove(+id);
  }
}
