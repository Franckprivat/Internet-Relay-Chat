import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  // ✅ Créer un message
  async createMessage(createMessageDto: CreateMessageDto) {
    const { senderId, nickname, content, channelId, recipientId } = createMessageDto;

    if (!channelId && !recipientId) {
      throw new BadRequestException('Un message doit être associé à un canal ou à un destinataire.');
    }

    // 🔍 Vérifie l'utilisateur par senderId ou nickname
    const user = await this.prisma.user.findUnique({
      where: senderId ? { id: senderId } : { nickname },
    });

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé.");
    }

    // ✅ Vérifie si le canal existe
    if (channelId) {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
      });
      if (!channel) {
        throw new NotFoundException(`Canal avec l'ID "${channelId}" non trouvé.`);
      }
    }

    // ✅ Vérifie si le destinataire existe (si c'est un message privé)
    if (recipientId) {
      const recipient = await this.prisma.user.findUnique({
        where: { id: recipientId },
      });
      if (!recipient) {
        throw new NotFoundException(`Destinataire avec l'ID "${recipientId}" non trouvé.`);
      }
    }

    // 💾 Création du message
    return await this.prisma.message.create({
      data: {
        senderId: user.id,
        content,
        channelId: channelId || null,
        recipientId: recipientId || null,
      },
    });
  }

  // ✅ Récupérer les messages d'un canal
  async getMessagesByChannel(channelId: number): Promise<any[]> {
    if (!channelId) {
      throw new BadRequestException("L'ID du canal est requis.");
    }

    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { timestamp: 'asc' },
      include: { user: true, recipient: true },
    });

    if (messages.length === 0) {
      throw new NotFoundException(`Aucun message trouvé pour le canal ID: ${channelId}`);
    }

    console.log(`Messages récupérés pour le canal ${channelId}:`, messages);

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      sender: message.user
        ? { id: message.user.id, nickname: message.user.nickname }
        : null,
    }));
  }

  // ✅ Récupérer les messages privés
  async getPrivateMessages(senderId: number, recipientId: number): Promise<any[]> {
    if (!senderId || !recipientId) {
      throw new BadRequestException("Les IDs de l'expéditeur et du destinataire sont requis.");
    }

    if (typeof senderId !== 'number' || typeof recipientId !== 'number') {
      throw new BadRequestException("Les IDs doivent être des nombres.");
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

    console.log(`Messages privés récupérés entre ${senderId} et ${recipientId}:`, messages);

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      sender: message.user
        ? { id: message.user.id, nickname: message.user.nickname }
        : null,
      recipient: message.recipient
        ? { id: message.recipient.id, nickname: message.recipient.nickname }
        : null,
    }));
  }

  // ✅ Récupérer tous les messages
  async findAll() {
    return await this.prisma.message.findMany();
  }

  // ✅ Récupérer un message par ID
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

  // ✅ Mettre à jour un message
  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<any> {
    const message = await this.prisma.message.update({
      where: { id },
      data: { content: updateMessageDto.content },
    });

    if (!message) {
      throw new NotFoundException(`Message avec l'ID "${id}" non trouvé.`);
    }

    return message;
  }

  // ✅ Supprimer un message
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
