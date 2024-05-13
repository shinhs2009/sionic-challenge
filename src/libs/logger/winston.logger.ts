import { Injectable, Scope, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger } from 'winston';
import { REQUEST } from '@nestjs/core';
import { LogLevel, LoggingConfig } from 'src/config/config';

@Injectable({ scope: Scope.REQUEST })
export class WinstonLogger {
	private readonly logger: Logger;

	constructor(
		private configService: ConfigService,
		@Inject(REQUEST) private req: Request,
	) {
		const requestId = this.req['requestId'];

		const defaultConfig: LoggingConfig = {
			logLevel: LogLevel.Info,
			timestampFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
			colorize: true,
			transports: {
				console: true,
				file: false,
				filePath: './logs/app.log',
			},
		};

		const loggingConfig: LoggingConfig = {
			...defaultConfig,
			...(this.configService.get<LoggingConfig>('logging', { infer: true }) || {}),
		};

		const loggerTransports = [];
		if (loggingConfig.transports.console) {
			loggerTransports.push(
				new transports.Console({
					format: format.combine(
						loggingConfig.colorize ? format.colorize() : format.uncolorize(),
						format.printf(
							info =>
								`${info.timestamp} [${info.level}] [Request-ID: ${requestId}] [Context: ${info.context}] ${info.message}`,
						),
					),
				}),
			);
		}
		if (loggingConfig.transports.file) {
			loggerTransports.push(
				new transports.File({
					filename: loggingConfig.transports.filePath,
					format: format.printf(
						info =>
							`${info.timestamp} [${info.level}] [Request-ID: ${requestId}] [Context: ${info.context}] ${info.message}`,
					),
				}),
			);
		}

		this.logger = createLogger({
			level: loggingConfig.logLevel,
			format: format.combine(
				format.timestamp({ format: loggingConfig.timestampFormat }),
				format.printf(
					info => `${info.timestamp} [Request-ID: ${requestId}] [${info.level}] ${info.message}`,
				),
			),
			transports: loggerTransports,
		});
	}

	log(message: string, context: string = 'General', meta?: any) {
		this.logger.info(message, { context, ...meta });
	}

	error(message: string, context: string = 'Error', trace: string = '', meta?: any) {
		this.logger.error(message, { trace, context, ...meta });
	}

	warn(message: string, context: string = 'Warning', meta?: any) {
		this.logger.warn(message, { context, ...meta });
	}

	debug(message: string, context: string = 'Debug', meta?: any) {
		this.logger.debug(message, { context, ...meta });
	}

	verbose(message: string, context: string = 'Verbose', meta?: any) {
		this.logger.verbose(message, { context, ...meta });
	}
}
