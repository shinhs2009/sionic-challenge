import { Body, Controller, Get, Inject, Param, Request, Post, UseGuards } from '@nestjs/common';
import { IChatService } from '../../application/chat.service.interface';
import { CreateChatDto } from '../../application/dto/ create-chat.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('chats')
export class ChatController {
	constructor(
		@Inject('IChatService')
		private chatService: IChatService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async createChat(@Body() createChatDto: CreateChatDto, @Request() req) {
		const user = req.user;
		return this.chatService.createChat(user.id, createChatDto.question);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':threadId')
	async getChatsByThread(@Param('threadId') threadId: number) {
		return this.chatService.getChatsByThread(threadId);
	}
}
