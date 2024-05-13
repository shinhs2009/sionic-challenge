import { Controller, Post, Body, UseGuards, Inject, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from '../../../auth/local-auth.guard';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { WinstonLogger } from 'src/libs/logger/winston.logger';
import { IUserService } from '../../application/user.service.interface';

@Controller('users')
export class UserController {
	constructor(
		@Inject('IUserService')
		private userService: IUserService,
		private logger: WinstonLogger,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req): Promise<{ access_token: string }> {
		return this.userService.login(req.user);
	}

	@Post()
	async createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(
			createUserDto.email,
			createUserDto.password,
			createUserDto.name,
			createUserDto.role,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req): any {
		return req.user;
	}
}
