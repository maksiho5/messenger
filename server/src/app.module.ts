import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat-module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ChatModule,
		PrismaModule,
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
