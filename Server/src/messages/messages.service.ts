import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const { senderId, content, channelId, recipientId } = createMessageDto;

    if (!channelId && !recipientId) {
      throw new BadRequestException(
        'Un message doit être associé à un canal ou à un destinataire.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: senderId } });
    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID "${senderId}" non trouvé.`,
      );
    }

    if (channelId) {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
      });
      if (!channel) {
        throw new NotFoundException(
          `Canal avec l'ID "${channelId}" non trouvé.`,
        );
      }
    }

    if (recipientId) {
      const recipient = await this.prisma.user.findUnique({
        where: { id: recipientId },
      });
      if (!recipient) {
        throw new NotFoundException(
          `Destinataire avec l'ID "${recipientId}" non trouvé.`,
        );
      }
    }

    return await this.prisma.message.create({
      data: {
        senderId,
        content: content,
        channelId: channelId || null,
        recipientId: recipientId || null,
      },
    });
  }

  async getMessagesByChannel(channelId: number): Promise<any[]> {
    if (!channelId) {
      throw new BadRequestException("L'ID du canal est requis.");
    }

    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { timestamp: 'asc' },
      include: { user: true },
    });

    if (messages.length === 0) {
      throw new NotFoundException(
        `Aucun message trouvé pour le canal ID: ${channelId}`,
      );
    }

    console.log(`Messages récupérés pour le canal ${channelId}:`, messages);

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      sender: message.user
        ? {
            id: message.user.id,
            nickname: message.user.nickname,
          }
        : null,
    }));
  }

  async getPrivateMessages(
    senderId: number,
    recipientId: number,
  ): Promise<any[]> {
    if (!senderId || !recipientId) {
      throw new BadRequestException(
        "Les IDs de l'expéditeur et du destinataire sont requis.",
      );
    }

    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
      orderBy: { timestamp: 'asc' },
      include: { user: true, recipient: true },
    });

    if (messages.length === 0) {
      throw new NotFoundException(
        `Aucun message trouvé entre l'utilisateur ${senderId} et ${recipientId}`,
      );
    }

    console.log(
      `Messages privés récupérés entre ${senderId} et ${recipientId}:`,
      messages,
    );

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      sender: message.user
        ? {
            id: message.user.id,
            nickname: message.user.nickname,
          }
        : null,
      recipient: message.recipient
        ? {
            id: message.recipient.id,
            nickname: message.recipient.nickname,
          }
        : null,
    }));
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { user: true, channel: true, recipient: true },
    });

    if (!message) {
      throw new NotFoundException(`Message avec l'ID "${id}" non trouvé.`);
    }

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<any> {
    const message = await this.prisma.message.update({
      where: { id },
      data: {
        content: updateMessageDto.content,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID "${id}" not found.`);
    }

    return message;
  }

  async remove(id: number) {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id },
    });
    if (!existingMessage) {
      throw new NotFoundException(`Message avec l'ID "${id}" non trouvé.`);
    }

    await this.prisma.message.delete({ where: { id } });
    return { message: 'Vous avez supprimé ce message.' };
  }
}
