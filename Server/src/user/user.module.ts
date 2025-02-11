import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { PrismaModule } from 'src/prisma.module';
import { PasswordModule } from './password.module';
import { ChannelsService } from 'src/channels/channels.service';

@Module({
  imports: [PrismaModule, PasswordModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, ChannelsService],
  exports: [UserService],
})
export class UserModule {}
