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
import { TQuery } from 'model/query.model';
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
  create(@Body() payload: CreateStoryDto) {
    payload = CreateStoryDto.plainToClass(payload);
    return this.storyService.create(payload);
  }

  // @Get('/abc')
  // abc() {
  //   return this.storyService.abc();
  // }

  // @Get('/xyz')
  // xyz() {
  //   return this.storyService.xyz();
  // }

  @Get()
  find(@Query() query: TQuery) {
    return this.storyService.find(query);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
  //   return this.storyService.update(+id, updateStoryDto);
  // }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyService.remove(+id);
  }
}
