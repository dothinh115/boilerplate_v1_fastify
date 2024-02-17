import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { TQuery } from 'model/query.model';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  create(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.refreshTokenService.create(createRefreshTokenDto);
  }

  @Get()
  find(@Query() query: TQuery) {
    return this.refreshTokenService.find(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refreshTokenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  ) {
    return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refreshTokenService.remove(+id);
  }
}
