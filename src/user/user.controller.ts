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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TQuery } from 'src/utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';

@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Post()
  create(@Body() payload: CreateUserDto, @Query() query: TQuery) {
    payload = CreateUserDto.plainToClass(payload);
    return this.userService.create(payload, query);
  }

  @UseGuards(RolesGuard)
  @Get()
  find(@Query() query: TQuery) {
    return this.userService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Query() query: TQuery,
  ) {
    return this.userService.update(id, updateUserDto, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
