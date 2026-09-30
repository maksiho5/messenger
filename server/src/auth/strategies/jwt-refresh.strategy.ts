import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly tokenService: TokenService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
					return req.cookies?.refreshToken;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
		});
	}

	async validate({ userId }: { userId: any }) {
		if (!userId) {
			throw new UnauthorizedException('Invalid refresh token');
		}
		if (userId.id) {
			return userId;
		}
		const user = await this.usersService.getOne({ id: userId });

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return user;
	}
}
