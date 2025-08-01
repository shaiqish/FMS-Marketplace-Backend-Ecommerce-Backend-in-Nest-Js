import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Response } from 'express';
import RequestWithUser from 'src/common/interfaces/RequestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getUser(@Request() req: RequestWithUser) {
    return req.user;
  }

  //OAuth from here

  @Get('google')
  redirectToGoogle(@Res() res: Response) {
    const url = this.authService.getGoogleOAuthURL();
    return res.redirect(url);
  }

  @Get('google/callback')
  async handleGoogleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    if (!code) throw new BadRequestException('No code provided');
    const result = await this.authService.handleGoogleCallback(code);

    // Optionally: issue your own JWT
    // const jwt = this.authService.generateToken(result.user);

    return res.json(result);
  }
}
