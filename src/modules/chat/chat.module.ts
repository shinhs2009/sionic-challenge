import { Module } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ChatController } from './infrastructure/web/chat.controller';
import { ChatService } from './application/chat.service';
import { ChatRepository } from './infrastructure/repository/chat.repository';
import { OpenAIService } from 'src/libs/openai/openai.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
	imports: [ConfigModule, UserModule],
	providers: [
		{
			provide: 'IChatService',
			useClass: ChatService,
		},
		{
			provide: 'IChatRepository',
			useClass: ChatRepository,
		},
		PrismaService,
		OpenAIService,
		JwtStrategy,
		JwtAuthGuard,
	],
	controllers: [ChatController],
})
export class ChatModule {}
