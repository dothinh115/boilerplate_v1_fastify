import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from 'src/response/response.service';
@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private responseService: ResponseService,
  ) {}

  transporter = nodemailer.createTransport({
    host: this.configService.get('MAIL_HOST'),
    auth: {
      user: this.configService.get('MAIL_USER'),
      pass: this.configService.get('MAIL_PASS'),
    },
  });

  async send(body: SendMailDto) {
    try {
      await this.transporter.sendMail(body);
      return this.responseService.successResponse(
        `Gửi email thành công đến ${body.to}`,
      );
    } catch (error) {
      console.log(error.response);
      return this.responseService.failResponse('Đã có lỗi xảy ra');
    }
  }
}
