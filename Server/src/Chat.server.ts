import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './messages/messages.service';
import { ChannelsService } from './channels/channels.service';
import { CreateChannelDto } from './channels/dto/create-channel.dto';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { UpdateMessageDto } from './messages/dto/update-message.dto';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateChannelDto } from './channels/dto/update-channel.dto';

@Injectable()
@WebSocketGateway(8007, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatServer
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly channelsService: ChannelsService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('login')
  async handleLogin(
    client: Socket,
    payload: { email: string; password: string },
  ) {
    console.log('Login request received:', payload);
    try {
      const user = await this.userService.login(payload);
      console.log('Login success:', user);
      client.emit('loginSuccess', user);
    } catch (error) {
      console.error('Login error:', error.message);
      client.emit('loginError', error.message);
    }
  }

  @SubscribeMessage('register')
  async handleRegister(client: Socket, payload: CreateUserDto) {
    console.log('Register request received:', payload);
    try {
      const user = await this.userService.create(payload);
      console.log('Registration success:', user);
      client.emit('registerSuccess', user);
    } catch (error) {
      console.error('Registration error:', error.message);
      client.emit('registerError', error.message);
    }
  }

  @SubscribeMessage('logout')
  async handleLogout(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId } = data;
      await this.userService.logout(userId);
      client.emit('logoutSuccess', { message: 'Déconnexion réussie.' });
      console.log(`User ${userId} logged out.`);
    } catch (error) {
      console.error(`Logout error: ${error.message}`);
      client.emit('error', `Erreur lors de la déconnexion.`);
    }
  }

  @SubscribeMessage('createChannel')
  async handleCreateChannel(
    @MessageBody() createChannelDto: CreateChannelDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('Create channel request received:', createChannelDto);
    try {
      const newChannel = await this.channelsService.create(createChannelDto);
      this.server.emit('channelCreated', newChannel);
      console.log(`[Create] Channel created: ${newChannel.name}`);
    } catch (error) {
      console.error(`[Error] ${error.message}`);
      client.emit('error', 'Error creating channel.');
    }
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() data: { channelName: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channelName, nickname } = data;
      await this.channelsService.joinChannel(channelName, nickname);
      client.join(channelName);
      client.to(channelName).emit('userJoined', { channelName, nickname });
      console.log(`[Join] ${nickname} joined ${channelName}`);
    } catch (error) {
      console.error(`Error joining channel: ${error.message}`);
      client.emit('error', `Error joining channel: ${error.message}`);
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @MessageBody() data: { channelName: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channelName, nickname } = data;
      await this.channelsService.leaveChannel(channelName, nickname);
      client.leave(channelName);
      client.to(channelName).emit('userLeft', { channelName, nickname });
      console.log(`[Leave] ${nickname} left ${channelName}`);
    } catch (error) {
      console.error(`Error leaving channel: ${error.message}`);
      client.emit('error', `Error leaving channel: ${error.message}`);
    }
  }

  @SubscribeMessage('listChannels')
  async handleListChannels(@ConnectedSocket() client: Socket): Promise<void> {
    const channels = await this.channelsService.findAll();
    client.emit('channelsList', channels);
    console.log(
      `[List] Available channels: ${channels.map((c) => c.name).join(', ')}`,
    );
  }

  @SubscribeMessage('updateChannel')
  async handleUpdateChannel(
    @MessageBody() data: { name: string; updateChannelDto: UpdateChannelDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedChannel = await this.channelsService.update(
        data.name,
        data.updateChannelDto,
      );
      this.server.emit('channelUpdated', updatedChannel);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      client.emit('error', `Error updating channel: ${error.message}`);
    }
  }

  @SubscribeMessage('deleteChannel')
  async handleDeleteChannel(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (
        !data.name ||
        typeof data.name !== 'string' ||
        data.name.trim() === ''
      ) {
        client.emit('error', 'Channel name is required for deletion.');
        return;
      }
      await this.channelsService.remove(data.name.trim());
      this.server.emit('channelDeleted', { name: data.name.trim() });
    } catch (error) {
      console.error(`Error deleting channel: ${error.message}`);
      client.emit('error', `Error deleting channel.`);
    }
  }

  @SubscribeMessage('addUserToChannel')
  async handleAddUserToChannel(
    @MessageBody() data: { channel: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channel, nickname } = data;
      if (!channel || !nickname) {
        client.emit('error', 'Channel name and nickname are required.');
        return;
      }
      const updatedChannel = await this.channelsService.addUserToChannel(
        channel,
        nickname,
      );
      this.server.emit('userAddedToChannel', {
        channel: channel,
        user: { nickname },
      });
      console.log(`[AddUser] ${nickname} added to ${channel}`);
    } catch (error) {
      console.error(`Error adding user to channel: ${error.message}`);
      client.emit('error', `Error adding user to channel.`);
    }
  }

  @SubscribeMessage('removeUserFromChannel')
  async handleRemoveUserFromChannel(
    @MessageBody() data: { channel: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channel, nickname } = data;
      await this.channelsService.removeUserFromChannel(channel, nickname);
      this.server.emit('userRemovedFromChannel', {
        channel: channel,
        nickname,
      });
      console.log(`[RemoveUser] ${nickname} removed from ${channel}`);
    } catch (error) {
      console.error(`Error removing user from channel: ${error.message}`);
      client.emit('error', `Error removing user from channel.`);
    }
  }

  @SubscribeMessage('getUsersInChannel')
  async handleGetUsersInChannel(
    @MessageBody() data: { channel: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channel } = data;
      const users = await this.channelsService.getUsersInChannel(channel);
      client.emit('usersInChannel', { channel: channel, users });
      console.log(
        `[Users] ${users.map((user) => user.nickname).join(', ')} in channel ${channel}`,
      );
    } catch (error) {
      console.error(`Error getting users in channel: ${error.message}`);
      client.emit('error', `Error getting users in channel.`);
    }
  }

  @SubscribeMessage('getChannelByName')
  async handleGetChannelByName(
    @MessageBody() data: { channelName: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { channelName } = data;
      const channel = await this.channelsService.getChannelByName(channelName);
      client.emit('channelFound', channel);
      console.log(`[Channel] ${channelName} found`);
    } catch (error) {
      console.error(`Error getting channel: ${error.message}`);
      client.emit('error', `Error getting channel: ${error.message}`);
    }
  }

  async createMessage(payload: CreateMessageDto) {
    return this.messageService.createMessage(payload);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    try {
      if (!payload.content || !payload.senderId) {
        throw new Error('Message must contain content and sender ID.');
      }

      const message = await this.createMessage(payload);

      if (payload.channelId) {
        this.server
          .to(`channel-${payload.channelId}`)
          .emit('newMessage', message);
      } else if (payload.recipientId) {
        this.server
          .to(`user-${payload.recipientId}`)
          .emit('privateMessage', message);
      }

      client.emit('messageSent', message);
      return message;
    } catch (error) {
      console.error('WebSocket error:', error.message);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: Socket, data: { channelId: number }) {
    try {
      const messages = await this.messageService.getMessagesByChannel(
        data.channelId,
      );
      client.emit('messageHistory', messages);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('getPrivateMessages')
  async handleGetPrivateMessages(
    @MessageBody() data: { senderId: number; recipientId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messages = await this.messageService.getPrivateMessages(
        data.senderId,
        data.recipientId,
      );
      client.emit('privateMessageHistory', messages);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody() data: { id: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updateMessageDto: UpdateMessageDto = { content: data.content };
      const updatedMessage = await this.messageService.update(
        data.id,
        updateMessageDto,
      );
      this.server.emit('messageUpdated', updatedMessage);
    } catch (error) {
      console.error(`Error updating message: ${error.message}`);
      client.emit('error', `Error updating message: ${error.message}`);
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() data: { id: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.messageService.remove(data.id);
      this.server.emit('messageDeleted', { id: data.id });
    } catch (error) {
      console.error(`Error deleting message: ${error.message}`);
      client.emit('error', `Error deleting message: ${error.message}`);
    }
  }
}
