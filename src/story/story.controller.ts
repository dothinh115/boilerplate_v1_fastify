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
import { TQuery } from 'model/query.model';

@Controller('story')
@UsePipes(new ValidationPipe())
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  create(@Body() payload: CreateStoryDto) {
    payload = CreateStoryDto.plainToClass(payload);
    return this.storyService.create(payload);
  }

  @Get('/abc')
  abc() {
    return this.storyService.abc();
  }

  @Get()
  findAll(
    @Query()
    query: TQuery,
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
