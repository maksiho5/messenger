import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

@Module({
	imports: [JwtModule.register({})],
	providers: [ConfigService, TokenService],
	exports: [TokenService],
})
export class TokenModule {}
