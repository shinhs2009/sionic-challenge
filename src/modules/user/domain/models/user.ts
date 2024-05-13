import { Role } from './enums';

export class User {
	id: number;
	email: string;
	password: string;
	name: string;
	createdAt: Date;
	role: Role;

	constructor(
		id: number,
		email: string,
		password: string,
		name: string,
		createdAt: Date,
		role: Role = Role.MEMBER,
	) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.name = name;
		this.createdAt = createdAt;
		this.role = role;
	}
}
