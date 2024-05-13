import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from 'src/modules/user/application/user.service.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject('IUserService')
		private userService: IUserService,
	) {
		super({
			usernameField: 'email',
			passwordField: 'password',
		});
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.userService.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}
}
