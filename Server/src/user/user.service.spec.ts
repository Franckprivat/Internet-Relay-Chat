import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { ChannelsService } from '../channels/channels.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: {} },  
        { provide: PasswordService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: ChannelsService, useValue: {} },
      ],
    }).compile();


    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
