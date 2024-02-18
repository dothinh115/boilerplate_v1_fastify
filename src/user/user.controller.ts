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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TQuery } from 'utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import roles from 'utils/roles';

@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Post()
  create(@Body() payload: CreateUserDto, @Query() query: TQuery) {
    payload = CreateUserDto.plainToClass(payload);
    return this.userService.create(payload, query);
  }

  @Get()
  find(@Query() query: TQuery) {
    return this.userService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin, roles.self)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Query() query: TQuery,
  ) {
    return this.userService.update(id, updateUserDto, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin, roles.self)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
