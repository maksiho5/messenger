import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
		});
	}

	async validate(email: string, password: string) {
		const user = await this.authService.validateUser(email, password);

		if (user == 'Не найдена почта') {
			throw new UnauthorizedException('Не найдена почта');
		} else if (user == 'Не верный пароль') {
			throw new UnauthorizedException('Не верный пароль');
		}

		return user;
	}
}
