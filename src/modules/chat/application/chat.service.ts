// src/chat/application/chat.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { IChatRepository } from '../domain/chat.repository.interface';
import { IChatService } from './chat.service.interface';
import { OpenAIService } from 'src/libs/openai/openai.service';

@Injectable()
export class ChatService implements IChatService {
	constructor(
		@Inject('IChatRepository')
		private chatRepository: IChatRepository,
		private openAiService: OpenAIService, // Inject your OpenAI service
	) {}

	async createChat(userId: number, question: string): Promise<Chat> {
		const recentThread = await this.chatRepository.findRecentThread(userId, 30);
		let threadId = recentThread?.id;

		if (!threadId) {
			const newThread = await this.chatRepository.createThread(userId);
			threadId = newThread.id;
		}

		const answer = await this.openAiService.getAIResponse(question); // Call ChatGPT to get an answer
		return this.chatRepository.createChat(question, JSON.stringify(answer), threadId);
	}

	async getChatsByThread(threadId: number): Promise<Chat[]> {
		console.log('Fetching chats for thread ID:', threadId);
		return this.chatRepository.getChatsByThread(threadId);
	}
}
