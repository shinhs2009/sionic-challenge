import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestIdMiddleware } from './libs/middleware/request-id.middleware';
import { WinstonLogger } from './libs/logger/winston.logger';
import { ResponseLoggingInterceptor } from './libs/middleware/response-logging.middleware';
import { loadYamlConfig } from './config/config';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [loadYamlConfig],
		}),
		UserModule,
		ChatModule,
	],
	providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseLoggingInterceptor }, WinstonLogger],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestIdMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
