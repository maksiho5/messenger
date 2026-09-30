import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { UsersModule } from 'src/users/users.module';
import { FriendService } from './services/friend.service';
import { MessageService } from './services/message.service';

@Module({
	providers: [ChatGateway, FriendService, MessageService],
	imports: [UsersModule],
})
export class ChatModule {}
