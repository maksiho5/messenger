import {
	BadRequestException,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import dayjs from 'dayjs';
import { PrismaService } from 'prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { UserStatusUpdateDto } from './dtos/user-status-update.dto';
import { AddFriendDto } from './dtos/add-friend.dto';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessageService } from './services/message.service';
import { FriendService } from './services/friend.service';

@WebSocketGateway(3002, {
	cors: {
		origin: '*',
		credentials: true,
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService,
		private readonly messageService: MessageService,
		private readonly friendService: FriendService
	) {}

	async handleConnection(client: Socket) {}

	async handleDisconnect(client: Socket) {}

	@SubscribeMessage('userStatusUpdate')
	async handleUserStatusUpdate(client: Socket, payload: UserStatusUpdateDto) {
		const { userId, online } = payload;

		await this.prismaService.user.update({
			where: { id: userId },
			data: { online: online, lastOnline: new Date().toISOString() },
		});

		this.server.emit('userStatus', { userId, online });
	}

	@SubscribeMessage('addFriend')
	async handleAddFriend(client: Socket, payload: AddFriendDto) {
		const chatCreated = await this.friendService.addFriend(
			payload.userId,
			payload.friendId
		);
		this.server.emit('newChats', chatCreated);
	}

	@SubscribeMessage('getChats')
	async handleGetChats(client: Socket, payload: { userId: string }) {
		const users = await this.friendService.getUsersFriends(payload.userId);

		return users
			? client.emit('getChats', users)
			: client.emit('getChats', []);
	}

	@SubscribeMessage('newMessage')
	async createMessage(client: Socket, payload: NewMessageDto) {
		const newMessage = await this.messageService.createMessage(payload);
		this.server.emit('getMessage', newMessage);
	}
	@SubscribeMessage('getMessagesUser')
	async getMessagesUser(client: Socket, payload: { idChat: string }) {
		const { idChat } = payload;

		const findMessages = await this.prismaService.message.findMany({
			where: { chatId: idChat },
		});

		this.server.emit('getMessagesUser', findMessages);
	}

	@SubscribeMessage('getUnreadMessages')
	async getUnreadMessages(
		client: Socket,
		payload: { chatId: string; userId: string }
	) {
		const messages = await this.prismaService.message.findMany({
			where: { chatId: payload.chatId, isRead: false },
		});

		const unreadCount = messages.length;
		this.server.emit('unreadMessagesCount', unreadCount);

		await this.prismaService.message.updateMany({
			where: { chatId: payload.chatId, isRead: false },
			data: { isRead: true },
		});
	}

	@SubscribeMessage('unreadMessagesCount')
	async unreadMessagesCount(
		client: Socket,
		payload: { chatId: string; userId: string }
	) {
		const messages = await this.prismaService.message.findMany({
			where: {
				chatId: payload.chatId,
				senderId: payload.userId,
				isRead: false,
			},
		});
		const unreadCount = messages.length;

		this.server.emit('unreadMessagesCount', messages);
	}
	@SubscribeMessage('deleteMessage')
	async deleteMessage(
		client: Socket,
		payload: {
			userId: string;
			selectedMessages: string[];
			selectedChat: any;
		}
	) {
		this.server.emit('deleteMessage', payload);
	}
}
