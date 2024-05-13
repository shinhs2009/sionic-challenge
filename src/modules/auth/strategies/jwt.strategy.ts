import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IUserService } from 'src/modules/user/application/user.service.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject('IUserService')
		private userService: IUserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: 'YOUR_SECRET_KEY',
		});
	}

	async validate(payload: any) {
		const user = await this.userService.findUserById(payload.sub);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}
}
