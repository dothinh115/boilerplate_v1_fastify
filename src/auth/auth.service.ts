import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshToken } from 'src/auth/dto/refresh-token.schema';
import { ResponseService } from 'src/response/response.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { TQuery } from 'src/utils/model/query.model';
import { UserService } from 'src/user/user.service';
import { CommonService } from 'src/common/common.service';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private responseService: ResponseService,
    private userService: UserService,
    private commonService: CommonService,
    private mailService: MailService,
  ) {}
  async login(body: LoginAuthDto) {
    const { email, password } = body;
    const emailCheck = await this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .select('+password');
    if (!emailCheck)
      return this.responseService.failResponse(
        'Email hoặc mật khẩu không đúng!',
      );
    const passwordCheck = this.commonService.bcriptCompare(
      password,
      emailCheck.password,
    );
    if (!passwordCheck)
      return this.responseService.failResponse(
        'Email hoặc mật khẩu không đúng!',
      );
    const access_token = this.commonService.getToken(
      { _id: emailCheck._id },
      '15m',
    );
    const refresh_token = this.commonService.getToken(
      { _id: emailCheck._id },
      '7d',
    );
    const createRefreshToken = {
      user: emailCheck._id,
      refresh_token,
    };
    await this.refreshTokenModel.findOneAndDelete({ user: emailCheck._id });
    await this.refreshTokenModel.create(createRefreshToken);
    return this.responseService.successResponse({
      access_token,
      refresh_token,
    });
  }

  async register(body: RegisterAuthDto, query: TQuery) {
    const exist = await this.userModel.findOne({
      email: body.email,
    });
    if (exist) return this.responseService.failResponse('Email đã được dùng!');
    return await this.userService.create(body, query);
  }

  async verifyEmail(_id: string, template: string) {
    const exist = await this.userModel.findById(_id);
    if (!exist)
      return this.responseService.failResponse('Không tồn tại user này!');
    await this.mailService.send({
      from: 'BOILERPLATE',
      html: template,
      subject: 'Kích hoạt tài khoản của bạn',
      to: exist.email,
    });
    return this.responseService.successResponse('Thành công!');
  }
}
