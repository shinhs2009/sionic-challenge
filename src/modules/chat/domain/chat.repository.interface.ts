import { Chat, Thread } from '@prisma/client';

export interface IChatRepository {
	createChat(question: string, answer: string, threadId: number): Promise<Chat>;
	findRecentThread(userId: number, durationMinutes: number): Promise<Thread | null>;
	createThread(userId: number): Promise<Thread>;
	getChatsByThread(threadId: number): Promise<Chat[]>;
}
