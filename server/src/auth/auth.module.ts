import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
	imports: [TokenModule, UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtRefreshStrategy,
		JwtAccessStrategy,
	],
})
export class AuthModule {}
