import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { ChannelsService } from './channels/channels.service';
import { MessageService } from './messages/messages.service';
import { PrismaService } from './prisma.service';
import { ChatModule } from './chat.module';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma.module';
import { PasswordService } from './user/password.service';
import { PasswordModule } from './user/password.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, ChannelsModule, MessagesModule, ChatModule, PasswordModule],
  controllers: [],
  providers: [UserService, MessageService,  ChannelsService, PrismaService, PasswordService], 
})
export class AppModule {}
