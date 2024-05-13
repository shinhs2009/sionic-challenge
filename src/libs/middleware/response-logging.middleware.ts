import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { WinstonLogger } from '../logger/winston.logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ResponseLoggingInterceptor implements NestInterceptor {
	constructor(private logger: WinstonLogger) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();
		const start = Date.now();

		return next.handle().pipe(
			tap(() => {
				const elapsed = Date.now() - start;
				const { method, url } = req;
				const { statusCode } = res;
				this.logger.log(`[${method}] ${url} ${statusCode} ${elapsed}ms`, 'HTTP');
			}),
		);
	}
}
