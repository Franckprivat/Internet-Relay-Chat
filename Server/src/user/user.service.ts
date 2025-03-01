import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from './password.service';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { ChannelsService } from '../channels/channels.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private channelsService: ChannelsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, nickname, email, password } = createUserDto;

    if (!firstName || !lastName || !nickname || !email || !password) {
      throw new BadRequestException(
        'Tous les champs requis doivent être fournis.',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const token = this.jwtService.sign({ email });

    try {
      return await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          nickname,
          email,
          password: hashedPassword,
          token,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          "Erreur de contrainte d'unicité sur l'email.",
        );
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Les identifiants sont incorrects.');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Les identifiants sont incorrects.');
    }

    const token = this.jwtService.sign({ email: user.email });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    return {
      user: {
        name: user.firstName,
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        token,
      },
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { token: null },
    });
    return { message: 'Déconnexion réussie.' };
  }

  async joinChannel(channelName: string, nickname: string) {
    return this.channelsService.joinChannel(channelName, nickname);
  }

  async leaveChannel(channel: string, nickname: string) {
    return this.channelsService.leaveChannel(channel, nickname);
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID "${id}" non trouvé.`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email cannot be undefined.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'email "${email}" non trouvé.`,
      );
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, nickname, email, password } = updateUserDto;

    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        nickname,
        email,
        password: password
          ? await this.passwordService.hashPassword(password)
          : userExists.password,
      },
    });
  }

  async remove(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`Utilisateur avec l'ID "${id}" non trouvé.`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé avec succès.' };
  }
}
