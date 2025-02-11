import { Controller, Post, Body, Get, HttpCode, Request, HttpStatus, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   http://localhost:3000/auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }
//   http://localhost:3000/auth/profile
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user; 
  }
}