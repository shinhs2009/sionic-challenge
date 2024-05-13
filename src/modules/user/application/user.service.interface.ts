import { Role, User } from 'src/modules/user/domain/models';

export interface IUserService {
	validateUser(email: string, password: string): Promise<User | null>;
	createUser(email: string, password: string, name: string, role: Role): Promise<User>;
	login(user: User): Promise<{ access_token: string }>;
	findUserById(id: number): Promise<User | null>;
}
