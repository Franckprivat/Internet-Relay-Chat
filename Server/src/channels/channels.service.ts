import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto): Promise<any> {
    const { name, topic, isPrivate, nickname } = createChannelDto;

    if (
      !name?.trim() ||
      !topic?.trim() ||
      typeof isPrivate !== 'boolean' ||
      !nickname?.trim()
    ) {
      throw new BadRequestException(
        "Le nom du canal et le pseudo de l'utilisateur sont requis.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new NotFoundException(`L'utilisateur "${nickname}" n'existe pas.`);
    }

    const existingChannel = await this.prisma.channel.findUnique({
      where: { name },
    });

    if (existingChannel) {
      throw new ConflictException(`Le canal "${name}" existe déjà.`);
    }

    const newChannel = await this.prisma.channel.create({
      data: {
        name,
        topic,
        isPrivate: isPrivate ?? false,
        ownerId: user.id,
        users: {
          create: [{ userId: user.id }],
        },
      },
      include: { users: true },
    });

    this.logger.log('✅ Canal créé avec succès :', newChannel);
    return newChannel;
  }

  async findAll(): Promise<any[]> {
    return this.prisma.channel.findMany({
      include: { users: true, messages: true },
    });
  }

  async findByName(name: string): Promise<any> {
    if (!name?.trim()) {
      throw new BadRequestException('Le nom du canal est requis.');
    }

    const channel = await this.prisma.channel.findUnique({
      where: { name },
      include: { users: true, messages: true },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${name}" n'existe pas.`);
    }
    return channel;
  }

  async update(name: string, updateChannelDto: UpdateChannelDto): Promise<any> {
    if (!name?.trim()) {
      throw new BadRequestException('Le nom du canal est requis.');
    }

    const channel = await this.prisma.channel.findUnique({ where: { name } });
    if (!channel) {
      throw new NotFoundException(`Le canal "${name}" n'existe pas.`);
    }

    if (updateChannelDto.name && updateChannelDto.name !== name) {
      const existingChannel = await this.prisma.channel.findUnique({
        where: { name: updateChannelDto.name },
      });
      if (existingChannel) {
        throw new BadRequestException(
          `Le nom "${updateChannelDto.name}" est déjà utilisé.`,
        );
      }
    }

    return this.prisma.channel.update({
      where: { name },
      data: updateChannelDto,
    });
  }

  async remove(name: string): Promise<{ message: string }> {
    if (!name?.trim()) {
      throw new BadRequestException(
        'Le nom du canal est requis pour la suppression.',
      );
    }

    const existingChannel = await this.prisma.channel.findUnique({
      where: { name },
    });
    if (!existingChannel) {
      throw new NotFoundException(`Le canal "${name}" n'existe pas.`);
    }
    await this.prisma.message.deleteMany({
      where: { channelId: existingChannel.id },
    });
    await this.prisma.userChannel.deleteMany({
      where: { channelId: existingChannel.id },
    });
    await this.prisma.channel.delete({ where: { name } });
    return { message: `Le canal "${name}" a été supprimé avec succès.` };
  }

  async addUserToChannel(channelName: string, nickname: string): Promise<any> {
    if (!channelName?.trim() || !nickname?.trim()) {
      throw new BadRequestException(
        "Le nom du canal et le pseudo de l'utilisateur sont requis.",
      );
    }

    this.logger.log(
      `Ajout de l'utilisateur ${nickname} au canal : ${channelName}`,
    );

    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new NotFoundException(`L'utilisateur "${nickname}" n'existe pas.`);
    }

    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${channelName}" n'existe pas.`);
    }

    return this.prisma.userChannel.create({
      data: {
        userId: user.id,
        channelId: channel.id,
      },
    });
  }

  async removeUserFromChannel(
    channelName: string,
    nickname: string,
  ): Promise<any> {
    if (!nickname?.trim()) {
      throw new BadRequestException("Le pseudo de l'utilisateur est requis.");
    }

    this.logger.log(
      `Retrait de l'utilisateur ${nickname} du canal : ${channelName}`,
    );

    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new NotFoundException(`L'utilisateur "${nickname}" n'existe pas.`);
    }

    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${channelName}" n'existe pas.`);
    }

    return this.prisma.userChannel.deleteMany({
      where: {
        userId: user.id,
        channelId: channel.id,
      },
    });
  }

  async getUsersInChannel(channelName: string): Promise<any[]> {
    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
      include: { users: { select: { user: true } } },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${channelName}" n'existe pas.`);
    }

    return channel.users.map((userChannel) => userChannel.user);
  }

  async getChannelByName(channelName: string): Promise<any> {
    this.logger.log(`Récupération du canal avec le nom : ${channelName}`);

    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
      include: { users: true, messages: true },
    });

    if (!channel) {
      throw new NotFoundException(
        `Le canal avec le nom "${channelName}" n'existe pas.`,
      );
    }

    return channel;
  }

  async joinChannel(channelName: string, nickname: string): Promise<any> {
    if (!channelName?.trim() || !nickname?.trim()) {
      throw new BadRequestException(
        "Le nom du canal et le pseudo de l'utilisateur sont requis.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new NotFoundException(`L'utilisateur "${nickname}" n'existe pas.`);
    }

    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${channelName}" n'existe pas.`);
    }

    const userChannel = await this.prisma.userChannel.findUnique({
      where: {
        userId_channelId: {
          userId: user.id,
          channelId: channel.id,
        },
      },
    });

    if (userChannel) {
      throw new ConflictException(
        `L'utilisateur "${nickname}" est déjà membre du canal "${channelName}".`,
      );
    }

    return this.prisma.userChannel.create({
      data: {
        userId: user.id,
        channelId: channel.id,
      },
    });
  }

  async leaveChannel(channelName: string, nickname: string): Promise<any> {
    if (!channelName?.trim() || !nickname?.trim()) {
      throw new BadRequestException(
        "Le nom du canal et le pseudo de l'utilisateur sont requis.",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new NotFoundException(`L'utilisateur "${nickname}" n'existe pas.`);
    }

    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });

    if (!channel) {
      throw new NotFoundException(`Le canal "${channelName}" n'existe pas.`);
    }

    const userChannel = await this.prisma.userChannel.findUnique({
      where: {
        userId_channelId: {
          userId: user.id,
          channelId: channel.id,
        },
      },
    });

    if (!userChannel) {
      throw new NotFoundException(
        `"${nickname}" n'est plus membre du canal "${channelName}".`,
      );
    }

    return this.prisma.userChannel.delete({
      where: {
        userId_channelId: {
          userId: user.id,
          channelId: channel.id,
        },
      },
    });
  }
}
