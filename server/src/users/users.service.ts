import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { verify, hash } from 'argon2';
@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}
	async createUser(data: RegisterDto) {
		const userCheckEmail = await this.prismaService.user.findFirst({
			where: { email: data.email },
		});

		let image;
		if (userCheckEmail) {
			throw new ConflictException('Такой пользователь уже существует');
		}

		if (typeof data.image == 'string') {
			image = data.image;
		} else {
			image = 'null';
		}
		const createdUser = await this.prismaService.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				image: image,
				lastOnline: new Date().toISOString(),
			},
		});

		return createdUser;
	}

	async getOne({ id, email }: GetUserDto) {
		if (!id && !email) {
			throw new BadRequestException(
				'Нет идентификатора или электронной почты для поиска пользователя'
			);
		}

		const user = await this.prismaService.user.findFirst({
			where: { email: email, id: id },
		});

		return user;
	}
	async updateUserLastOnline(userId: string) {
		await this.prismaService.user.update({
			where: { id: userId },
			data: { lastOnline: new Date().toISOString() },
		});
	}
	async addFriend(userId: string, friendId: string) {
		if (!userId || !friendId) {
			throw new BadRequestException(
				'User ID or Friend ID should not be undefined'
			);
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		const friend = await this.prismaService.user.findUnique({
			where: { id: friendId },
		});

		if (!user || !friend) {
			throw new NotFoundException('Один или оба пользователя не найдены');
		}

		const existingFriendship = await this.prismaService.friend.findFirst({
			where: {
				userId,
				friendId,
			},
		});

		if (existingFriendship) {
			throw new ConflictException('Дружба уже существует');
		}

		const chatId = uuidv4();

		// Создание записи о дружбе
		const frien = await this.prismaService.friend.create({
			data: {
				userId,
				friendId,
				chatId,
			},
		});

		return frien;
	}
	async handleUserStatusUpdate(userId: string, online: boolean) {
		return await this.prismaService.user.update({
			where: { id: userId },
			data: { online: online, lastOnline: new Date().toISOString() },
		});
	}

	async updatePassword(
		newPassword: string,
		oldPassword: string,
		hashedPassword: string,
		userId: string
	) {
		const isValid = await verify(hashedPassword, oldPassword);

		if (!isValid) {
			throw new BadRequestException('Не тот пароль');
		}

		const newHashedPassword = await hash(newPassword);

		await this.prismaService.user.update({
			where: { id: userId },
			data: { password: newHashedPassword },
		});

		return { password: newHashedPassword };
	}
}
