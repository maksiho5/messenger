import {
	Body,
	Controller,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'prisma/prisma.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly prismaService: PrismaService
	) {}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('search')
	async searchAccounts(@Req() req) {
		const user = req.user;

		const search = await this.usersService.getOne({
			email: req.body.content,
		});

		if (!search) {
			return { err: 'Не найдено' };
		}
		return search;
	}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('add_friends')
	async addFriends(@Req() req) {
		const id = req.body.id;
		const user = req.user;

		const addChat = this.usersService.addFriend(id, user.id);
		return addChat;
	}

	@Post('update_image')
	@UseInterceptors(FileInterceptor('file'))
	async updateImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
		const userId = req.body.id;

		const updateImage = await this.authService.handleFileUpload(file);

		await this.prismaService.user.update({
			where: { id: userId },
			data: { image: updateImage },
		});

		return { image: updateImage };
	}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('update_name')
	async updateName(@Req() req) {
		const userId = req.user.id;
		const newName = req.body.newName;
		const updateName = await this.prismaService.user.update({
			where: { id: userId },
			data: { name: newName }, // Установка текущего времени
		});
		return updateName;
	}
	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('update_password')
	async updatePassword(@Req() req) {
		const password = req.user.password;
		const userID = req.user.id;
		const newPassword = req.body.newPassword;
		const oldPassword = req.body.oldPassword;
		await this.usersService.updatePassword(
			newPassword,
			oldPassword,
			password,
			userID
		);
		return req.user;
	}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('delete_message')
	async deleteMessage(@Req() req, @Body() body: { messageIds: string[] }) {
		const messageIds = body.messageIds;

		await Promise.all(
			messageIds.map((id) =>
				this.prismaService.message.deleteMany({
					where: {
						id,
						senderId: req.user.id,
					},
				})
			)
		);

		return { success: true, ids: messageIds };
	}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('update_message')
	async updateMessage(
		@Req() req,
		@Body() body: { id: string; content: string }
	) {
		const { id, content } = body;
		try {
			//Check if message exists and belongs to the user.  Important for security.
			const message = await this.prismaService.message.findFirst({
				where: {
					id,
					senderId: req.user.id,
				},
			});

			if (!message) {
				throw new Error(
					'Сообщение не найдено или у вас нет разрешения на его обновление.'
				);
			}

			const updatedMessage = await this.prismaService.message.update({
				where: { id },
				data: { content },
			});
			return { success: true, message: updatedMessage };
		} catch (error) {
			console.error('Ошибка при обновлении сообщения ', error);
			//Return a more specific error message to the client.
			return { success: false, error: error.message };
		}
	}
	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('delete_chat')
	async deleteChat(@Req() req) {
		const chatId = req.body.chatId;

		try {
			// Удаляем чат из базы данных.
			await this.prismaService.friend.deleteMany({
				where: {
					chatId: chatId,
				},
			});

			return { success: true };
		} catch (error) {
			console.error('Ошибка при удалении чата: ', error);
			return { success: false, error: error.message };
		}
	}
}
