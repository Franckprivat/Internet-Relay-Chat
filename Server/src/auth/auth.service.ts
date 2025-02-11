import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from 'src/user/password.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Votre Email ou mot de passe sont incorrect.');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      pass,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Votre mot de passe est incorrect.');
    }

    const payload = { sub: user.id, nickname: user.nickname, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && await this.passwordService.comparePasswords(pass, user.password)) {
      return user;
    }
    return null;
  }
}
