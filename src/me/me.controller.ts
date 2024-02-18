import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MeService } from './me.service';
import { TokenRequired } from 'src/strategy';
import { TQuery } from 'utils/model/query.model';
import { CustomRequest } from 'utils/model/request.model';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('me')
export class MeController {
  constructor(
    private meService: MeService,
    private userService: UserService,
  ) {}

  @UseGuards(TokenRequired)
  @Get()
  find(@Req() req: CustomRequest, @Query() query: TQuery) {
    const { _id } = req.user;
    return this.meService.find(_id, query);
  }

  @UseGuards(TokenRequired)
  @Patch()
  update(
    @Req() req: CustomRequest,
    @Body() body: UpdateUserDto,
    @Query() query: TQuery,
  ) {
    const { _id } = req.user;
    return this.userService.update(_id, body, query);
  }
}
