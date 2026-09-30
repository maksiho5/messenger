import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService
	) {}
	async generateTokens(userId: string, res: Response) {
		const accessToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
				expiresIn: '50m',
			}
		);

		const refreshToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
			}
		);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
		});

		return { accessToken, refreshToken };
	}
	async saveToken(refreshToken: string, userID: string) {
		const findToken = await this.prismaService.token.findFirst({
			where: {
				userId: userID,
			},
		});

		if (findToken) {
			return await this.prismaService.token.update({
				where: {
					id: findToken.id,
				},
				data: {
					refreshToken: refreshToken,
				},
			});
		}

		return await this.prismaService.token.create({
			data: {
				userId: userID,
				refreshToken: refreshToken,
			},
		});
	}
	async findToken(userId?: string, refreshToken?: string) {
		const tokenData = await this.prismaService.token.findFirst({
			where: {
				userId,
				refreshToken,
			},
		});
		return tokenData;
	}
	async verify(accessToken: string) {
		try {
			// Здесь мы получаем секрет
			const secret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
			console.log('Secret: ', secret); // Проверяем получаем ли секрет

			const jwtAccess = this.jwtService.verify(accessToken, {
				secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
			});
			return jwtAccess;
		} catch (error) {
			console.error('Token verification failed:', error);
			throw error; // Можно бросить ошибку, если токен недействителен
		}
	}
	async removeToken(userId: string): Promise<void> {
		await this.prismaService.token.deleteMany({
			where: {
				userId: userId,
			},
		});
	}
}
