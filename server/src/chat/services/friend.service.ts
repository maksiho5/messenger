import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FriendService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService
	) {}

	async addFriend(userId: string, friendId: string) {
		if (!userId || !friendId) {
			throw new BadRequestException(
				'User ID or Friend ID should not be undefined'
			);
		}

		// Проверим, существует ли пользователь, и есть ли у них уже дружба
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		const friend = await this.prismaService.user.findUnique({
			where: { id: friendId },
		});

		if (!user || !friend) {
			throw new NotFoundException('Один или оба пользователя не найдены');
		}

		// Проверка, существует ли уже дружба
		const existingFriendship = await this.prismaService.friend.findFirst({
			where: {
				OR: [
					{ userId: userId, friendId: friendId },
					{ userId: friendId, friendId: userId }, // Проверяем дружбу в обоих направлениях
				],
			},
		});

		if (existingFriendship) {
			throw new ConflictException('Дружба уже существует');
		}

		// Создание новой дружбы
		const chatId = uuidv4();
		await this.prismaService.friend.create({
			data: {
				userId,
				friendId,
				chatId,
			},
		});

		const chatCreated = await this.getUsersFriends(userId);
		return chatCreated;
	}

	async getUsersFriends(userId: string) {
		const user = await this.prismaService.friend.findMany({
			where: {
				OR: [{ friendId: userId }, { userId: userId }],
			},
		});

		const usersChats = [];
		for (const friend of user) {
			const friendAccount = await this.usersService.getOne({
				id: friend.userId,
			});
			const myAccount = await this.usersService.getOne({
				id: friend.friendId,
			});
			usersChats.push({ ...friend, friendAccount, myAccount });
		}

		return usersChats;
	}
}
