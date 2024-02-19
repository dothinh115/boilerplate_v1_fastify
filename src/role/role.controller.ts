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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { TQuery } from 'src/utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';

@UsePipes(new ValidationPipe())
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Post()
  create(@Body() body: CreateRoleDto, @Query() query: TQuery) {
    body = CreateRoleDto.plainToClass(body);
    return this.roleService.create(body, query);
  }

  @UseGuards(RolesGuard)
  @Get()
  find(@Query() query: TQuery) {
    return this.roleService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
    @Query() query: TQuery,
  ) {
    body = UpdateRoleDto.plainToClass(body);
    return this.roleService.update(id, body, query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
