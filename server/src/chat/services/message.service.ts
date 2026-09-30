import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NewMessageDto } from '../dtos/new-message.dto';

@Injectable()
export class MessageService {
	constructor(private readonly prismaService: PrismaService) {}

	async createMessage(payload: NewMessageDto) {
		const { message, myId, idChat } = payload;

		const newMessage = await this.prismaService.message.create({
			data: {
				timestamp: new Date().toISOString(),
				content: message,
				chatId: idChat,
				senderId: myId,
				isRead: false,
			},
		});

		await this.prismaService.friend.updateMany({
			where: { chatId: idChat },
			data: { lastMessage: message },
		});
		return newMessage;
	}

	async getMessages(idChat: string) {
		// Логика получения сообщений
	}
}
