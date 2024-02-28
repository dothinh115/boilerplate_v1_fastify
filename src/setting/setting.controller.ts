import { Controller, Get, Body, Patch, Query, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { TQuery } from 'src/utils/model/query.model';
import { TokenRequired } from 'src/strategy';
import { RolesGuard } from 'src/guard/roles.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  find(@Query() query: TQuery) {
    return this.settingService.find(query);
  }

  @UseGuards(TokenRequired, RolesGuard)
  @Patch()
  update(@Body() body: UpdateSettingDto, @Query() query: TQuery) {
    body = UpdateSettingDto.plainToClass(body);
    return this.settingService.update(body, query);
  }
}
