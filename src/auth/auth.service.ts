import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/auth/dto/refresh-token.schema';
import { ResponseService } from 'src/response/response.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
    private responseService: ResponseService,
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
    const passwordCheck = bcrypt.compareSync(password, emailCheck.password);
    if (!passwordCheck)
      return this.responseService.failResponse(
        'Email hoặc mật khẩu không đúng!',
      );
    const access_token = this.jwtService.sign(
      { _id: emailCheck._id },
      { expiresIn: '15m' },
    );
    const refresh_token = this.jwtService.sign(
      { _id: emailCheck._id },
      { expiresIn: '7d' },
    );
    const createRefreshToken = {
      user: emailCheck._id,
      refresh_token,
      expires: new Date(this.jwtService.decode(refresh_token).exp),
    };
    await this.refreshTokenModel.findOneAndDelete({ user: emailCheck._id });
    await this.refreshTokenModel.create(createRefreshToken);
    return this.responseService.successResponse({
      access_token,
      refresh_token,
    });
  }
}
