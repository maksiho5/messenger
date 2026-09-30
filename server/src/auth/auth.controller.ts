import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { Response, Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from 'src/token/token.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService,
		private readonly usersService: UsersService
	) {}

	@Post('register')
	@UseInterceptors(FileInterceptor('file'))
	async register(
		@Body() data: RegisterDto,
		@UploadedFile() image: Express.Multer.File,
		@Res({ passthrough: true }) res: Response
	) {
		const userData = await this.authService.register(
			{ ...data, image },
			res
		);
		return res.status(201).send({ ...userData, ok: true });
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() req, @Res({ passthrough: true }) res: Response) {
		await this.usersService.updateUserLastOnline(req.user.id);
		const token = await this.tokenService.generateTokens(req.user.id, res);
		await this.tokenService.saveToken(token.refreshToken, req.user.id);

		return { ...token, ...req.user, ok: true };
	}

	@UseGuards(AuthGuard('jwt-refresh'))
	@Post('refresh')
	async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
		const user = req.user;
		await this.usersService.updateUserLastOnline(user.id);
		const token = await this.tokenService.generateTokens(user.id, res);
		await this.tokenService.saveToken(token.refreshToken, user.id);
		return { ...token, ...user };
	}

	@UseGuards(AuthGuard('jwt-accesss'))
	@Post('getAccount')
	async getAccount(@Req() req) {
		const user = req.user;
		await this.usersService.handleUserStatusUpdate(user.id, true);

		return { ...user, ok: true };
	}
	@UseGuards(AuthGuard('jwt-refresh'))
	@Post('logout')
	async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
		const user = req.user;

		// 1. Удаляем refresh токен из базы данных
		await this.tokenService.removeToken(user.id);

		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: true,
		});

		return {
			message: 'Выход выполнен успешно',
			ok: true,
		};
	}
}
