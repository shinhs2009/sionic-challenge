import { Role, User } from './models';

export interface IUserRepository {
	findOne(email: string): Promise<User | null>;
	create(email: string, password: string, name: string, role?: Role): Promise<User>;
	findById(id: number): Promise<User | null>;
}
