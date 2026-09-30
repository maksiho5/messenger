import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'get-user') {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
		});
	}

	async validate({
		refreshToken,
		accessToken,
	}: {
		refreshToken: string;
		accessToken: string;
	}) {}
}
