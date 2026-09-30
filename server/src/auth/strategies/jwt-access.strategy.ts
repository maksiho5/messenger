import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
	Strategy,
	'jwt-accesss'
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('accessToken'), // Correctly extract from Authorization header
			secretOrKey: configService.get('JWT_ACCESS_SECRET'),
		});
	}

	async validate({ userId }) {
		if (userId.id == undefined) {
			const user = await this.usersService.getOne({ id: userId });
			if (!user) {
			}
			return user;
		}

		return userId;
	}
}
