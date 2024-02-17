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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import roles from 'utils/roles';
import { TQuery } from 'model/query.model';

@Controller('author')
@UsePipes(new ValidationPipe())
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Post()
  create(@Body() payload: CreateAuthorDto) {
    payload = CreateAuthorDto.plainToClass(payload);
    return this.authorService.create(payload);
  }

  // @Get('/abc')
  // abc() {
  //   return this.authorService.abc();
  // }

  @Get()
  find(@Query() query: TQuery) {
    return this.authorService.find(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }
}
