import { Chat } from '@prisma/client';

export interface IChatService {
	createChat(userId: number, question: string): Promise<Chat>;
	getChatsByThread(threadId: number): Promise<Chat[]>;
}
