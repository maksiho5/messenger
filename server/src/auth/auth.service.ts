import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { hash, verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService
	) {}

	async register(
		{ name, email, password, image }: RegisterDto,
		res: Response
	) {
		const hashedPassword = await hash(password);

		let imageUrl: string | undefined;

		if (image && typeof image !== 'string') {
			imageUrl = await this.handleFileUpload(image);
		}

		const createdUser = await this.usersService.createUser({
			name,
			email,
			password: hashedPassword,
			image: imageUrl,
		});

		const accessToken = await this.tokenService.generateTokens(
			createdUser.id,
			res
		);
		await this.tokenService.saveToken(
			accessToken.refreshToken,
			createdUser.id
		);

		return { ...createdUser, access: accessToken };
	}

	async handleFileUpload(file: Express.Multer.File): Promise<string> {
		if (!file) {
			throw new BadRequestException('File not provided');
		}

		const safeFileName = file.originalname.replace(/[<>:"/\\|?*]/g, '_');
		const fileName = `${uuidv4()}_${safeFileName}`;
		const uploadDir = join(__dirname, '..', '..', 'uploads');

		if (!existsSync(uploadDir)) {
			mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = join(uploadDir, fileName);
		writeFileSync(filePath, file.buffer);

		return `/uploads/${fileName}`;
	}

	async validateUser(email: string, password: string) {
		const userByEmail = await this.usersService.getOne({ email });
		if (!userByEmail) {
			return 'Не найдена почта';
		}
		const checkValid = await verify(userByEmail.password, password);
		return checkValid ? userByEmail : 'Не верный пароль';
	}
}
