import { Module } from '@nestjs/common';
import { ChatServer } from 'src/Chat.server';
import { UserModule } from './user/user.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';


@Module({
  imports: [UserModule, ChannelsModule, MessagesModule],
  providers: [ChatServer],
  exports: [ChatServer],
})
export class ChatModule {}
