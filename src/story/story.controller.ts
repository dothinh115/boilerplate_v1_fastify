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
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Controller('story')
@UsePipes(new ValidationPipe())
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  create(@Body() payload: CreateStoryDto) {
    payload = CreateStoryDto.plainToClass(payload);
    return this.storyService.create(payload);
  }

  @Get()
  findAll(
    @Query()
    query: {
      fields: string;
      filter: object;
      limit: number;
      page: number;
      populate: string;
      meta: {
        total_count: boolean;
        filter_count: boolean;
      };
    },
  ) {
    return this.storyService.find(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.storyService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
  //   return this.storyService.update(+id, updateStoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.storyService.remove(+id);
  // }
}
