import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PasswordService } from 'src/user/password.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
