import { Test, TestingModule } from '@nestjs/testing';
import { ChatServer } from './Chat.server';
import { UserService } from './user/user.service';
import { MessageService } from './messages/messages.service';
import { ChannelsService } from './channels/channels.service';

describe('ChatServer', () => {
  let chatServer: ChatServer;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatServer,
        {
          provide: UserService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {},
        },
        {
          provide: ChannelsService,
          useValue: {},
        },
      ],
    }).compile();

    chatServer = module.get<ChatServer>(ChatServer);
    userService = module.get<UserService>(UserService);
  });

  it('should handle successful login', async () => {
    const mockClient = {
      emit: jest.fn(),
      join: jest.fn(), 
    };
    const mockUser = { id: 1, name: 'John Doe' };
    const payload = { email: 'john@example.com', password: '123456' };

    (userService.login as jest.Mock).mockResolvedValue({ user: mockUser });

    await chatServer.handleLogin(mockClient as any, payload);

    expect(mockClient.join).toHaveBeenCalledWith(`user-${mockUser.id}`);

    expect(mockClient.emit).toHaveBeenCalledWith('loginSuccess', mockUser);
  });

  it('should handle login error', async () => {
    const mockClient = {
      emit: jest.fn(),
      join: jest.fn(),
    };
    const payload = { email: 'john@example.com', password: 'wrongpass' };

    (userService.login as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials'),
    );

    await chatServer.handleLogin(mockClient as any, payload);

    expect(mockClient.emit).toHaveBeenCalledWith('loginError', 'Invalid credentials');
  });
});
