import { Injectable, Inject } from '@nestjs/common';
import { User, Role } from '../domain/models';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserService } from './user.service.interface';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UserService implements IUserService {
	constructor(
		@Inject('IUserRepository')
		private userRepository: IUserRepository,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userRepository.findOne(email);
		if (user && (await bcrypt.compare(password, user.password))) {
			return user;
		}
		return null;
	}

	async createUser(
		email: string,
		password: string,
		name: string,
		role: Role = Role.MEMBER,
	): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return this.userRepository.create(email, hashedPassword, name, role);
	}

	async login(user: User): Promise<{ access_token: string }> {
		const payload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async findUserById(id: number): Promise<User | null> {
		return this.userRepository.findById(id);
	}
}
