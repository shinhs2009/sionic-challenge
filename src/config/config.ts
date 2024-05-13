import { Type, plainToInstance } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested,
	validateSync,
} from 'class-validator';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

enum Environment {
	Development = 'development',
	Production = 'production',
	Local = 'local',
	Test = 'test',
}

export enum LogLevel {
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
	Http = 'http',
	Verbose = 'verbose',
	Debug = 'debug',
	Silly = 'silly',
}

export class TransportConfig {
	@IsBoolean()
	console: boolean;

	@IsBoolean()
	file: boolean;

	@IsString()
	@IsOptional()
	filePath?: string;
}

export class LoggingConfig {
	@IsEnum(LogLevel)
	logLevel: LogLevel;

	@IsString()
	timestampFormat: string;

	@IsBoolean()
	colorize: boolean;

	@ValidateNested()
	@Type(() => TransportConfig)
	transports: TransportConfig;
}

export class DatabaseConfig {
	@IsString()
	dsn: string;
}

export class OpenAIConfig {
	@IsString()
	apiKey: string;
}

export class Config {
	@IsEnum(Environment)
	env: Environment;

	@ValidateNested()
	@Type(() => LoggingConfig)
	logging: LoggingConfig;

	@ValidateNested()
	@Type(() => DatabaseConfig)
	database: DatabaseConfig;

	@ValidateNested()
	@Type(() => OpenAIConfig)
	openai: OpenAIConfig;
}

export const loadYamlConfig = () => {
	try {
		const yamlContent = fs.readFileSync('./config.yaml', 'utf8');
		const config = yaml.load(yamlContent);
		const validated = validate(config);
		console.log('Loaded YAML configuration:', config);
		return validated;
	} catch (e) {
		console.error('Failed to load YAML configuration:', e);
		return {};
	}
};

function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(Config, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });
	if (errors.length > 0) {
		throw new Error(`Configuration validation error: ${errors.toString()}`);
	}
	return validatedConfig;
}
