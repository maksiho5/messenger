import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenModule } from 'src/token/token.module';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access.strategy';
import { AuthService } from 'src/auth/auth.service';

@Module({
	imports: [TokenModule],
	controllers: [UsersController],
	providers: [UsersService, JwtAccessStrategy, AuthService],
	exports: [UsersService],
})
export class UsersModule {}
