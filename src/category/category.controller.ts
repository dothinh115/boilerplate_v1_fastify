import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { TQuery } from 'src/utils/model/query.model';

@Controller('category')
@UsePipes(new ValidationPipe())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Post()
  create(@Body() body: CreateCategoryDto, @Query() query: TQuery) {
    body = CreateCategoryDto.plainToClass(body);
    return this.categoryService.create(body, query);
  }

  @UseGuards(RolesGuard)
  @Get()
  find(@Query() query: TQuery) {
    return this.categoryService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @Query() query: TQuery,
  ) {
    body = UpdateCategoryDto.plainToClass(body);
    return this.categoryService.update(+id, body, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
