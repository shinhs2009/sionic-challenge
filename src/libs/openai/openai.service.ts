import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { ChatCompletion } from 'openai/resources';

export type Model =
	| 'gpt-4-turbo'
	| 'gpt-4-turbo-2024-04-09'
	| 'gpt-4-0125-preview'
	| 'gpt-4-turbo-preview'
	| 'gpt-4-1106-preview'
	| 'gpt-4-vision-preview'
	| 'gpt-4'
	| 'gpt-4-0314'
	| 'gpt-4-0613'
	| 'gpt-4-32k'
	| 'gpt-4-32k-0314'
	| 'gpt-4-32k-0613'
	| 'gpt-3.5-turbo'
	| 'gpt-3.5-turbo-16k'
	| 'gpt-3.5-turbo-0301'
	| 'gpt-3.5-turbo-0613'
	| 'gpt-3.5-turbo-1106'
	| 'gpt-3.5-turbo-0125'
	| 'gpt-3.5-turbo-16k-0613';

@Injectable()
export class OpenAIService {
	private openAI: OpenAI;

	constructor(private configService: ConfigService) {
		this.openAI = new OpenAI({
			apiKey: configService.get<string>('openai.apiKey'),
		});
	}

	async getAIResponse(
		question: string,
		model: Model = 'gpt-3.5-turbo',
	): Promise<ChatCompletion.Choice> {
		const response = await this.openAI.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: question,
				},
			],
			model: model,
		});
		return response.choices[0];
	}
}
