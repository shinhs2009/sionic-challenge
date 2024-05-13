import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/web/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { WinstonLogger } from 'src/libs/logger/winston.logger';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule.register({
			secret: 'YOUR_SECRET_KEY',
			signOptions: { expiresIn: '60m' },
		}),
	],
	providers: [
		{
			provide: 'IUserService',
			useClass: UserService,
		},
		{
			provide: 'IUserRepository',
			useClass: UserRepository,
		},
		PrismaService,
		LocalStrategy,
		JwtStrategy,
		JwtAuthGuard,
		ConfigService,
		WinstonLogger,
	],
	controllers: [UserController],
	exports: ['IUserService'],
})
export class UserModule {}
