import { Injectable } from '@nestjs/common';
import { Chat, Thread } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { IChatRepository } from '../../domain/chat.repository.interface';

@Injectable()
export class ChatRepository implements IChatRepository {
	constructor(private prisma: PrismaService) {}

	async createChat(question: string, answer: string, threadId: number): Promise<Chat> {
		return this.prisma.chat.create({
			data: { question, answer, threadId },
		});
	}

	async findRecentThread(userId: number, durationMinutes: number): Promise<Thread | null> {
		return this.prisma.thread.findFirst({
			where: {
				userId,
				createdAt: {
					gt: new Date(Date.now() - durationMinutes * 60 * 1000),
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async createThread(userId: number): Promise<Thread> {
		return this.prisma.thread.create({
			data: {
				userId,
			},
		});
	}

	async getChatsByThread(threadId: number): Promise<Chat[]> {
		return this.prisma.chat.findMany({
			where: { threadId },
			orderBy: { createdAt: 'asc' }, // Ordering chats by creation time
		});
	}
}
