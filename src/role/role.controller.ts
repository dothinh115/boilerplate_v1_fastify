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
import { TQuery } from 'utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import roles from 'utils/roles';

@UsePipes(new ValidationPipe())
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
  @Post()
  create(@Body() body: CreateRoleDto, @Query() query: TQuery) {
    body = CreateRoleDto.plainToClass(body);
    return this.roleService.create(body, query);
  }

  @Get()
  find(@Query() query: TQuery) {
    return this.roleService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Roles(roles.admin)
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
  @Roles(roles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
