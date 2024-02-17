import { Controller } from '@nestjs/common';
import { ConvertService } from './convert.service';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}
}
