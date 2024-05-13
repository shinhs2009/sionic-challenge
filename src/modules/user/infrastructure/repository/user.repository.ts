import { Injectable } from '@nestjs/common';
import { User, Role as DomainRole } from '../../domain/models';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { Role as PrismaRole } from '@prisma/client';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(private prisma: PrismaService) {}

	async findOne(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (user) {
			const role: DomainRole = DomainRole[user.role as keyof typeof DomainRole];
			return new User(user.id, user.email, user.password, user.name, user.createdAt, role);
		}
		return null;
	}

	async create(
		email: string,
		password: string,
		name: string,
		role: DomainRole = DomainRole.MEMBER,
	): Promise<User> {
		const prismaRole: PrismaRole = role as PrismaRole;
		const createdUser = await this.prisma.user.create({
			data: {
				email,
				password,
				name,
				role: prismaRole,
			},
		});
		return new User(
			createdUser.id,
			createdUser.email,
			createdUser.password,
			createdUser.name,
			createdUser.createdAt,
			role,
		);
	}

	async findById(id: number): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: { id },
		});

		if (user) {
			const role: DomainRole = DomainRole[user.role as keyof typeof DomainRole];
			return new User(user.id, user.email, user.password, user.name, user.createdAt, role);
		}
		return null;
	}
}
